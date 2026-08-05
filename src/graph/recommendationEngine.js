/**
 * Recommendation Engine for Graph Database
 * Implements Collaborative Filtering Graph Paths, Content Traversal, and Graph PageRank Walks
 */

export function getRecommendations(graphStore, userId, mode = 'hybrid') {
  const targetUser = graphStore.getNode(userId);
  if (!targetUser) return [];

  // Find movies already rated by target user
  const ratedEdges = graphStore.getEdgesForNode(userId)
    .filter(e => e.relation === 'RATED');
  
  const ratedMovieIds = new Set(
    ratedEdges.map(e => e.source === userId ? e.target : e.source)
  );

  const ratedMap = new Map();
  ratedEdges.forEach(e => {
    const mId = e.source === userId ? e.target : e.source;
    ratedMap.set(mId, e.properties.score || 3);
  });

  const candidates = new Map(); // movieId -> { score, reasons: [], paths: [] }

  // -------------------------------------------------------------
  // Algorithm 1: Collaborative Path Traversal (User-Movie-User-Movie)
  // TargetUser -> RATED(>=4) -> Movie A <- RATED(>=4) <- SimilarUser -> RATED(>=4) -> Candidate Movie B
  // -------------------------------------------------------------
  const collaborativeScores = new Map();

  for (const [movieId, score] of ratedMap.entries()) {
    if (score < 3.5) continue; // Only positively rated movies generate recommendations

    // Find other users who rated this movie
    const movieNeighbors = graphStore.getNeighbors(movieId);
    const otherUsers = movieNeighbors.filter(n => n.node.type === 'User' && n.node.id !== userId);

    for (const userNeighbor of otherUsers) {
      const otherUser = userNeighbor.node;
      const otherUserRating = userNeighbor.edges.find(e => e.relation === 'RATED')?.properties.score || 3;
      
      if (otherUserRating < 3.5) continue; // High agreement threshold

      // Find all movies rated high by this similar user
      const similarUserNeighbors = graphStore.getNeighbors(otherUser.id);
      const candidateMovies = similarUserNeighbors.filter(
        n => n.node.type === 'Movie' && !ratedMovieIds.has(n.node.id)
      );

      for (const cand of candidateMovies) {
        const candidateMovie = cand.node;
        const candEdge = cand.edges.find(e => e.relation === 'RATED');
        const candScore = candEdge?.properties.score || 3;

        if (candScore >= 3.5) {
          const pathScore = (score * otherUserRating * candScore) / 125.0 * 40; // Normalize
          
          if (!collaborativeScores.has(candidateMovie.id)) {
            collaborativeScores.set(candidateMovie.id, {
              movie: candidateMovie,
              score: 0,
              reasons: [],
              paths: []
            });
          }

          const entry = collaborativeScores.get(candidateMovie.id);
          entry.score += pathScore;
          entry.reasons.push(`Watched by ${otherUser.name} who also loved ${graphStore.getNode(movieId)?.title}`);
          entry.paths.push([userId, movieId, otherUser.id, candidateMovie.id]);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // Algorithm 2: Content Graph Path Traversal
  // TargetUser -> RATED -> Loved Movie -> [DIRECTED/ACTED_IN/HAS_GENRE] -> Entity -> [...] -> Candidate Movie
  // -------------------------------------------------------------
  const contentScores = new Map();

  for (const [movieId, score] of ratedMap.entries()) {
    if (score < 4.0) continue;
    const lovedMovie = graphStore.getNode(movieId);
    if (!lovedMovie) continue;

    // Traverse outward from loved movie to Director, Actors, Genres
    const movieNeighbors = graphStore.getNeighbors(movieId);

    for (const neighbor of movieNeighbors) {
      const entityNode = neighbor.node;
      if (['Director', 'Actor', 'Genre'].includes(entityNode.type)) {
        // Find other movies connected to this entity
        const entityNeighbors = graphStore.getNeighbors(entityNode.id);
        const candidateMovies = entityNeighbors.filter(
          n => n.node.type === 'Movie' && !ratedMovieIds.has(n.node.id)
        );

        for (const cand of candidateMovies) {
          const candidateMovie = cand.node;
          let weight = 10;
          let reasonText = '';

          if (entityNode.type === 'Director') {
            weight = 35;
            reasonText = `Also directed by ${entityNode.name}`;
          } else if (entityNode.type === 'Actor') {
            weight = 25;
            reasonText = `Stars ${entityNode.name} (from ${lovedMovie.title})`;
          } else if (entityNode.type === 'Genre') {
            weight = 15;
            reasonText = `Shares ${entityNode.name} genre with ${lovedMovie.title}`;
          }

          if (!contentScores.has(candidateMovie.id)) {
            contentScores.set(candidateMovie.id, {
              movie: candidateMovie,
              score: 0,
              reasons: [],
              paths: []
            });
          }

          const entry = contentScores.get(candidateMovie.id);
          entry.score += weight * (score / 5.0);
          entry.reasons.push(reasonText);
          entry.paths.push([userId, movieId, entityNode.id, candidateMovie.id]);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // Algorithm 3: Personalized PageRank (PPR Random Walk with Restart)
  // -------------------------------------------------------------
  const pprScores = runPersonalizedPageRank(graphStore, userId, ratedMovieIds);

  // Combine Scores based on Mode
  const allCandidateIds = new Set([
    ...collaborativeScores.keys(),
    ...contentScores.keys(),
    ...pprScores.keys()
  ]);

  const finalRecommendations = [];

  for (const candId of allCandidateIds) {
    const movie = graphStore.getNode(candId);
    if (!movie || ratedMovieIds.has(candId)) continue;

    const collab = collaborativeScores.get(candId) || { score: 0, reasons: [], paths: [] };
    const content = contentScores.get(candId) || { score: 0, reasons: [], paths: [] };
    const ppr = pprScores.get(candId) || 0;

    let finalScore = 0;
    if (mode === 'collaborative') {
      finalScore = collab.score;
    } else if (mode === 'content') {
      finalScore = content.score;
    } else if (mode === 'pagerank') {
      finalScore = ppr * 200;
    } else { // Hybrid
      finalScore = (collab.score * 0.4) + (content.score * 0.4) + (ppr * 150 * 0.2);
    }

    // Merge unique reasons
    const allReasons = Array.from(new Set([...collab.reasons, ...content.reasons]));
    if (allReasons.length === 0) {
      allReasons.push(`Graph Walk proximity score: ${(ppr * 100).toFixed(1)}%`);
    }

    const allPaths = [...collab.paths, ...content.paths];

    // Normalized match score (0..99%)
    const matchPercentage = Math.min(99, Math.max(65, Math.round(70 + finalScore * 0.4)));

    finalRecommendations.push({
      movie,
      matchPercentage,
      rawScore: Math.round(finalScore * 10) / 10,
      reasons: allReasons.slice(0, 3),
      samplePath: allPaths[0] || [userId, candId]
    });
  }

  // Sort descending by match score
  return finalRecommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Executes Personalized PageRank starting from user node
 */
function runPersonalizedPageRank(graphStore, startUserId, ratedMovieIds, maxSteps = 1000, alpha = 0.85) {
  const nodes = graphStore.getAllNodes();
  if (nodes.length === 0) return new Map();

  const visitCounts = new Map();
  let currentNodeId = startUserId;

  for (let step = 0; step < maxSteps; step++) {
    // With probability (1 - alpha), jump back to start user
    if (Math.random() > alpha) {
      currentNodeId = startUserId;
    } else {
      const neighbors = graphStore.getNeighbors(currentNodeId);
      if (neighbors.length === 0) {
        currentNodeId = startUserId;
      } else {
        const randomIndex = Math.floor(Math.random() * neighbors.length);
        currentNodeId = neighbors[randomIndex].node.id;
      }
    }

    visitCounts.set(currentNodeId, (visitCounts.get(currentNodeId) || 0) + 1);
  }

  // Convert counts to normalized probabilities for unrated movies
  const scores = new Map();
  for (const [nodeId, count] of visitCounts.entries()) {
    const node = graphStore.getNode(nodeId);
    if (node && node.type === 'Movie' && !ratedMovieIds.has(nodeId)) {
      scores.set(nodeId, count / maxSteps);
    }
  }

  return scores;
}

/**
 * Basic Cypher-like Query Parser
 * Example: MATCH (u:User)-[:RATED]->(m:Movie)
 */
export function executeCypherQuery(graphStore, queryText) {
  const cleanQuery = queryText.trim();
  const results = [];

  // Template query match handlers
  if (cleanQuery.toLowerCase().includes('match (m:movie)')) {
    const movies = graphStore.getAllNodes().filter(n => n.type === 'Movie');
    return {
      columns: ['Movie ID', 'Title', 'Year', 'Rating'],
      rows: movies.map(m => [m.id, m.title, m.year, m.rating])
    };
  }

  if (cleanQuery.toLowerCase().includes('match (u:user)-[:rated]->(m:movie)')) {
    const edges = graphStore.getAllEdges().filter(e => e.relation === 'RATED');
    const rows = edges.map(e => {
      const u = graphStore.getNode(e.source);
      const m = graphStore.getNode(e.target);
      return [u?.name || e.source, 'RATED', m?.title || e.target, e.properties.score + ' ★'];
    });
    return {
      columns: ['User', 'Relationship', 'Movie', 'Rating'],
      rows
    };
  }

  if (cleanQuery.toLowerCase().includes('match (d:director)-[:directed]->(m:movie)')) {
    const edges = graphStore.getAllEdges().filter(e => e.relation === 'DIRECTED');
    const rows = edges.map(e => {
      const d = graphStore.getNode(e.source);
      const m = graphStore.getNode(e.target);
      return [d?.name || e.source, 'DIRECTED', m?.title || e.target, m?.year];
    });
    return {
      columns: ['Director', 'Relationship', 'Movie', 'Year'],
      rows
    };
  }

  // Default fallback match
  const allNodes = graphStore.getAllNodes();
  return {
    columns: ['Node ID', 'Type', 'Name / Title'],
    rows: allNodes.slice(0, 10).map(n => [n.id, n.type, n.name || n.title])
  };
}
