// ==========================================
// CINEGRAPH MOVIE RECOMMENDATION SYSTEM
// Seed Script - Cypher Queries for CognoDB / Neo4j
// ==========================================

// 1. CLEAR EXISTING GRAPH DATA (Optional)
MATCH (n) DETACH DELETE n;

// 2. CREATE UNIQUE CONSTRAINTS
CREATE CONSTRAINT IF NOT EXISTS
FOR (u:User)
REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS
FOR (m:Movie)
REQUIRE m.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS
FOR (a:Actor)
REQUIRE a.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS
FOR (d:Director)
REQUIRE d.id IS UNIQUE;

CREATE CONSTRAINT IF NOT EXISTS
FOR (g:Genre)
REQUIRE g.id IS UNIQUE;

// 3. CREATE GENRE NODES
CREATE (g_scifi:Genre {id: 'g_scifi', name: 'Sci-Fi', color: '#06b6d4'})
CREATE (g_action:Genre {id: 'g_action', name: 'Action', color: '#f43f5e'})
CREATE (g_drama:Genre {id: 'g_drama', name: 'Drama', color: '#a855f7'})
CREATE (g_thriller:Genre {id: 'g_thriller', name: 'Thriller', color: '#eab308'})
CREATE (g_crime:Genre {id: 'g_crime', name: 'Crime', color: '#ef4444'})
CREATE (g_animation:Genre {id: 'g_animation', name: 'Animation', color: '#10b981'})
CREATE (g_adventure:Genre {id: 'g_adventure', name: 'Adventure', color: '#3b82f6'});

// 4. CREATE DIRECTOR NODES
CREATE (d_nolan:Director {id: 'd_nolan', name: 'Christopher Nolan'})
CREATE (d_tarantino:Director {id: 'd_tarantino', name: 'Quentin Tarantino'})
CREATE (d_villeneuve:Director {id: 'd_villeneuve', name: 'Denis Villeneuve'})
CREATE (d_miyazaki:Director {id: 'd_miyazaki', name: 'Hayao Miyazaki'})
CREATE (d_fincher:Director {id: 'd_fincher', name: 'David Fincher'});

// 5. CREATE ACTOR NODES
CREATE (a_dicaprio:Actor {id: 'a_dicaprio', name: 'Leonardo DiCaprio'})
CREATE (a_bale:Actor {id: 'a_bale', name: 'Christian Bale'})
CREATE (a_chalamet:Actor {id: 'a_chalamet', name: 'Timothée Chalamet'})
CREATE (a_pitt:Actor {id: 'a_pitt', name: 'Brad Pitt'})
CREATE (a_murphy:Actor {id: 'a_murphy', name: 'Cillian Murphy'})
CREATE (a_zendaya:Actor {id: 'a_zendaya', name: 'Zendaya'});

// 6. CREATE MOVIE NODES
CREATE (m_inception:Movie {id: 'm_inception', title: 'Inception', year: 2010, rating: 8.8, runtime: '148 min'})
CREATE (m_interstellar:Movie {id: 'm_interstellar', title: 'Interstellar', year: 2014, rating: 8.7, runtime: '169 min'})
CREATE (m_oppenheimer:Movie {id: 'm_oppenheimer', title: 'Oppenheimer', year: 2023, rating: 8.9, runtime: '180 min'})
CREATE (m_dark_knight:Movie {id: 'm_dark_knight', title: 'The Dark Knight', year: 2008, rating: 9.0, runtime: '152 min'})
CREATE (m_dune:Movie {id: 'm_dune', title: 'Dune: Part One', year: 2021, rating: 8.0, runtime: '155 min'})
CREATE (m_dune2:Movie {id: 'm_dune2', title: 'Dune: Part Two', year: 2024, rating: 8.6, runtime: '166 min'})
CREATE (m_fight_club:Movie {id: 'm_fight_club', title: 'Fight Club', year: 1999, rating: 8.8, runtime: '139 min'})
CREATE (m_pulp_fiction:Movie {id: 'm_pulp_fiction', title: 'Pulp Fiction', year: 1994, rating: 8.9, runtime: '154 min'})
CREATE (m_spirited_away:Movie {id: 'm_spirited_away', title: 'Spirited Away', year: 2001, rating: 8.6, runtime: '125 min'});

// 7. CREATE USER NODES
CREATE (u_alice:User {id: 'u_alice', name: 'Alice Chen', role: 'Sci-Fi & Nolan Enthusiast'})
CREATE (u_bob:User {id: 'u_bob', name: 'Bob Smith', role: 'Drama & Crime Cinephile'})
CREATE (u_charlie:User {id: 'u_charlie', name: 'Charlie Kim', role: 'Action & Adventure Buff'});

// 8. CREATE MOVIE -> GENRE RELATIONSHIPS (BELONGS_TO)
MATCH (m:Movie {id: 'm_inception'}), (g:Genre {id: 'g_scifi'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_inception'}), (g:Genre {id: 'g_action'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_inception'}), (g:Genre {id: 'g_thriller'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_interstellar'}), (g:Genre {id: 'g_scifi'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_interstellar'}), (g:Genre {id: 'g_drama'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_interstellar'}), (g:Genre {id: 'g_adventure'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_oppenheimer'}), (g:Genre {id: 'g_drama'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_dark_knight'}), (g:Genre {id: 'g_action'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_dark_knight'}), (g:Genre {id: 'g_crime'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_dark_knight'}), (g:Genre {id: 'g_drama'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_dune'}), (g:Genre {id: 'g_scifi'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_dune'}), (g:Genre {id: 'g_adventure'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_dune2'}), (g:Genre {id: 'g_scifi'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_dune2'}), (g:Genre {id: 'g_adventure'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_fight_club'}), (g:Genre {id: 'g_drama'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_fight_club'}), (g:Genre {id: 'g_thriller'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_pulp_fiction'}), (g:Genre {id: 'g_crime'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_pulp_fiction'}), (g:Genre {id: 'g_drama'}) MERGE (m)-[:BELONGS_TO]->(g);

MATCH (m:Movie {id: 'm_spirited_away'}), (g:Genre {id: 'g_animation'}) MERGE (m)-[:BELONGS_TO]->(g);
MATCH (m:Movie {id: 'm_spirited_away'}), (g:Genre {id: 'g_adventure'}) MERGE (m)-[:BELONGS_TO]->(g);

// 9. CREATE DIRECTOR -> MOVIE RELATIONSHIPS (DIRECTED)
MATCH (d:Director {id: 'd_nolan'}), (m:Movie {id: 'm_inception'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_nolan'}), (m:Movie {id: 'm_interstellar'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_nolan'}), (m:Movie {id: 'm_oppenheimer'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_nolan'}), (m:Movie {id: 'm_dark_knight'}) MERGE (d)-[:DIRECTED]->(m);

MATCH (d:Director {id: 'd_villeneuve'}), (m:Movie {id: 'm_dune'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_villeneuve'}), (m:Movie {id: 'm_dune2'}) MERGE (d)-[:DIRECTED]->(m);

MATCH (d:Director {id: 'd_fincher'}), (m:Movie {id: 'm_fight_club'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_tarantino'}), (m:Movie {id: 'm_pulp_fiction'}) MERGE (d)-[:DIRECTED]->(m);
MATCH (d:Director {id: 'd_miyazaki'}), (m:Movie {id: 'm_spirited_away'}) MERGE (d)-[:DIRECTED]->(m);

// 10. CREATE ACTOR -> MOVIE RELATIONSHIPS (ACTED_IN)
MATCH (a:Actor {id: 'a_dicaprio'}), (m:Movie {id: 'm_inception'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_murphy'}), (m:Movie {id: 'm_inception'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_murphy'}), (m:Movie {id: 'm_interstellar'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_chalamet'}), (m:Movie {id: 'm_interstellar'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_murphy'}), (m:Movie {id: 'm_oppenheimer'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_bale'}), (m:Movie {id: 'm_dark_knight'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_murphy'}), (m:Movie {id: 'm_dark_knight'}) MERGE (a)-[:ACTED_IN]->(m);

MATCH (a:Actor {id: 'a_chalamet'}), (m:Movie {id: 'm_dune'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_zendaya'}), (m:Movie {id: 'm_dune'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_chalamet'}), (m:Movie {id: 'm_dune2'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_zendaya'}), (m:Movie {id: 'm_dune2'}) MERGE (a)-[:ACTED_IN]->(m);

MATCH (a:Actor {id: 'a_pitt'}), (m:Movie {id: 'm_fight_club'}) MERGE (a)-[:ACTED_IN]->(m);
MATCH (a:Actor {id: 'a_pitt'}), (m:Movie {id: 'm_pulp_fiction'}) MERGE (a)-[:ACTED_IN]->(m);

// 11. CREATE USER -> MOVIE RELATIONSHIPS (WATCHED)
MATCH (u:User {id: 'u_alice'}), (m:Movie {id: 'm_inception'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_alice'}), (m:Movie {id: 'm_interstellar'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_alice'}), (m:Movie {id: 'm_dune'}) MERGE (u)-[:WATCHED {score: 4}]->(m);

MATCH (u:User {id: 'u_bob'}), (m:Movie {id: 'm_fight_club'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_bob'}), (m:Movie {id: 'm_pulp_fiction'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_bob'}), (m:Movie {id: 'm_oppenheimer'}) MERGE (u)-[:WATCHED {score: 4}]->(m);
MATCH (u:User {id: 'u_bob'}), (m:Movie {id: 'm_inception'}) MERGE (u)-[:WATCHED {score: 4}]->(m);

MATCH (u:User {id: 'u_charlie'}), (m:Movie {id: 'm_dark_knight'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_charlie'}), (m:Movie {id: 'm_dune2'}) MERGE (u)-[:WATCHED {score: 5}]->(m);
MATCH (u:User {id: 'u_charlie'}), (m:Movie {id: 'm_inception'}) MERGE (u)-[:WATCHED {score: 4}]->(m);

// 12. CREATE USER SOCIAL GRAPH (FRIEND_WITH)
MATCH (u1:User {id: 'u_alice'}), (u2:User {id: 'u_bob'}) MERGE (u1)-[:FRIEND_WITH]->(u2);
MATCH (u1:User {id: 'u_bob'}), (u2:User {id: 'u_charlie'}) MERGE (u1)-[:FRIEND_WITH]->(u2);
MATCH (u1:User {id: 'u_charlie'}), (u2:User {id: 'u_alice'}) MERGE (u1)-[:FRIEND_WITH]->(u2);
