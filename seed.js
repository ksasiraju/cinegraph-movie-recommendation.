// ==========================================
// CINEGRAPH - CognoDB / Neo4j Database Seed Script
// Usage: node seed.js
// ==========================================

import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = process.env.VITE_NEO4J_URI || process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.VITE_NEO4J_USER || process.env.NEO4J_USER || 'neo4j';
const password = process.env.VITE_NEO4J_PASSWORD || process.env.NEO4J_PASSWORD || 'password';

console.log(`Connecting to Graph Database at ${uri}...`);

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function seedDatabase() {
const session = driver.session({
  database: "neo4j"
});
  try {
    const cypherFilePath = path.join(__dirname, 'seed.cypher');
    const cypherContent = fs.readFileSync(cypherFilePath, 'utf-8');

    // Split statements by semicolon
    // Remove comment lines first
const cleanedCypher = cypherContent
  .split('\n')
  .filter(line => !line.trim().startsWith('//'))
  .join('\n');

// Split into individual statements
const statements = cleanedCypher
  .split(';')
  .map(s => s.trim())
  .filter(Boolean);
    console.log(`Executing ${statements.length} Cypher statements...`);

    for (const stmt of statements) {
      await session.run(stmt);
    }

    console.log('✅ Graph Database successfully seeded!');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
