// ==========================================
// CINEGRAPH MOVIE RECOMMENDATION SYSTEM
// Assignment Required Cypher Queries
// ==========================================

// ------------------------------------------
// QUERY 1: Display All Nodes of a Type
// ------------------------------------------
// Purpose: Fetch all students/users or movies in the graph
MATCH (m:Movie)
RETURN m.id AS Id, m.title AS Title, m.year AS Year, m.rating AS Rating;

MATCH (u:User)
RETURN u.id AS UserId, u.name AS Name, u.role AS Role;


// ------------------------------------------
// QUERY 2: Show Movies a User has Watched (1-Hop Traversal)
// ------------------------------------------
// Purpose: Traverses from a specific User to all Movies they have rated/watched
MATCH (u:User {name: 'Alice Chen'})-[w:WATCHED]->(m:Movie)
RETURN u.name AS User, m.title AS MovieTitle, w.score AS UserRating, m.year AS Year;


// ------------------------------------------
// QUERY 3: Multi-Hop Query (2 Hops) - Collaborative Recommendation
// ------------------------------------------
// Purpose: "Find movies watched by Alice's friends that Alice hasn't watched yet"
// Traversal: (User: Alice) -[1: FRIEND_WITH]-> (User: Friend) -[2: WATCHED]-> (Movie: Recommended)
MATCH (u:User {name: 'Alice Chen'})-[:FRIEND_WITH]->(f:User)-[r:WATCHED]->(m:Movie)
WHERE NOT (u)-[:WATCHED]->(m) AND r.score >= 4
RETURN m.title AS RecommendedMovie, 
       f.name AS WatchedByFriend, 
       r.score AS FriendRating,
       m.rating AS OverallImdbScore
ORDER BY r.score DESC;


// ------------------------------------------
// QUERY 4: Multi-Hop Query (3+ Hops) - Content Graph Path Discovery
// ------------------------------------------
// Purpose: "Find movies featuring actors who acted in movies directed by Christopher Nolan"
// Traversal: (Director) <-[1: DIRECTED]- (Movie1) <-[2: ACTED_IN]- (Actor) -[3: ACTED_IN]-> (Movie2)
MATCH (d:Director {name: 'Christopher Nolan'})<-[:DIRECTED]-(m1:Movie)<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(m2:Movie)
WHERE m1 <> m2
RETURN d.name AS Director,
       m1.title AS NolanMovie,
       a.name AS CoStarActor,
       m2.title AS RecommendedMovie;


// ------------------------------------------
// QUERY 5: Query Difficult in Traditional Relational DB (Shortest Path Traversal)
// ------------------------------------------
// Purpose: Find shortest path up to 5 degrees of separation between two users or entities.
// Why hard in SQL: In relational SQL databases, finding paths of variable/unknown depth requires 
// complex RECURSIVE CTEs (Common Table Expressions) and multiple self-JOINs, resulting in $O(N^k)$ explosion.
// In Cypher, graph index-free adjacency allows $O(k)$ graph traversal.
MATCH path = shortestPath((u1:User {name: 'Alice Chen'})-[:FRIEND_WITH|WATCHED|ACTED_IN|DIRECTED*..5]-(u2:User {name: 'Bob Smith'}))
RETURN path, length(path) AS HopDistance;
