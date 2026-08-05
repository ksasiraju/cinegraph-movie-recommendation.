/**
 * GraphStore - In-Memory Graph Database Data Structure
 * Represents a Property Graph with Nodes & Typed Directed/Undirected Edges.
 */
export class GraphStore {
  constructor(dataset) {
    this.nodes = new Map(); // id -> Node object
    this.edges = [];        // Array of Edge objects
    this.adjacency = new Map(); // nodeId -> Map<neighborId, Edge[]>
    
    if (dataset) {
      this.initFromDataset(dataset);
    }
  }

  initFromDataset(dataset) {
    // Add Genre Nodes
    dataset.genres.forEach(g => {
      this.addNode({ id: g.id, type: 'Genre', name: g.name, color: g.color });
    });

    // Add Director Nodes
    dataset.directors.forEach(d => {
      this.addNode({ id: d.id, type: 'Director', name: d.name, image: d.image });
    });

    // Add Actor Nodes
    dataset.actors.forEach(a => {
      this.addNode({ id: a.id, type: 'Actor', name: a.name, image: a.image });
    });

    // Add Movie Nodes & internal relationships
    dataset.movies.forEach(m => {
      this.addNode({
        id: m.id,
        type: 'Movie',
        title: m.title,
        year: m.year,
        rating: m.rating,
        runtime: m.runtime,
        overview: m.overview,
        poster: m.poster
      });

      // (Director)-[:DIRECTED]->(Movie)
      if (m.directorId) {
        this.addEdge(m.directorId, m.id, 'DIRECTED', { weight: 1.5 });
      }

      // (Actor)-[:ACTED_IN]->(Movie)
      if (m.actorIds) {
        m.actorIds.forEach(actorId => {
          this.addEdge(actorId, m.id, 'ACTED_IN', { weight: 1.2 });
        });
      }

      // (Movie)-[:HAS_GENRE]->(Genre)
      if (m.genreIds) {
        m.genreIds.forEach(genreId => {
          this.addEdge(m.id, genreId, 'HAS_GENRE', { weight: 1.0 });
        });
      }
    });

    // Add User Nodes
    dataset.users.forEach(u => {
      this.addNode({ id: u.id, type: 'User', name: u.name, role: u.role, avatar: u.avatar });
    });

    // Add User Ratings (User)-[:RATED]->(Movie)
    dataset.ratings.forEach(r => {
      this.addEdge(r.userId, r.movieId, 'RATED', { score: r.score });
    });
  }

  addNode(nodeData) {
    this.nodes.set(nodeData.id, nodeData);
    if (!this.adjacency.has(nodeData.id)) {
      this.adjacency.set(nodeData.id, new Map());
    }
  }

  addEdge(sourceId, targetId, relation, properties = {}) {
    const edge = {
      id: `${sourceId}-${relation}-${targetId}`,
      source: sourceId,
      target: targetId,
      relation,
      properties
    };

    this.edges.push(edge);

    // Update Adjacency lists (both directions for graph traversal)
    this._addToAdjacency(sourceId, targetId, edge);
    this._addToAdjacency(targetId, sourceId, edge);

    return edge;
  }

  _addToAdjacency(from, to, edge) {
    if (!this.adjacency.has(from)) {
      this.adjacency.set(from, new Map());
    }
    const fromMap = this.adjacency.get(from);
    if (!fromMap.has(to)) {
      fromMap.set(to, []);
    }
    fromMap.get(to).push(edge);
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getNeighbors(nodeId) {
    const neighborMap = this.adjacency.get(nodeId);
    if (!neighborMap) return [];
    
    const results = [];
    for (const [neighborId, edges] of neighborMap.entries()) {
      results.push({
        node: this.nodes.get(neighborId),
        edges
      });
    }
    return results;
  }

  getEdgesForNode(nodeId) {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  getAllEdges() {
    return this.edges;
  }

  // Get graph analytics
  getStats() {
    const nodeCounts = {};
    for (const node of this.nodes.values()) {
      nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1;
    }

    const totalNodes = this.nodes.size;
    const totalEdges = this.edges.length;
    const maxEdgesPossible = totalNodes * (totalNodes - 1) / 2;
    const density = maxEdgesPossible > 0 ? (totalEdges / maxEdgesPossible).toFixed(4) : 0;
    const avgDegree = totalNodes > 0 ? ((2 * totalEdges) / totalNodes).toFixed(2) : 0;

    return {
      totalNodes,
      totalEdges,
      nodeCounts,
      density,
      avgDegree
    };
  }

  // Compute node degree centrality
  getDegreeCentrality() {
    const centralities = [];
    for (const [nodeId, neighborMap] of this.adjacency.entries()) {
      const node = this.nodes.get(nodeId);
      let degree = 0;
      for (const edges of neighborMap.values()) {
        degree += edges.length;
      }
      centralities.push({ node, degree });
    }
    return centralities.sort((a, b) => b.degree - a.degree);
  }
}
