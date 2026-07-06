import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function setup() {
  const client = createClient({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN! 
  });

  try {
    console.log('Dropping and recreating translations table for schema sync...');
    await client.execute(`DROP TABLE IF EXISTS translations;`);
    await client.execute(`
      CREATE TABLE translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transcript TEXT NOT NULL,
        gloss TEXT,
        pose_url TEXT,
        swr TEXT,
        timestamp INTEGER DEFAULT (strftime('%s','now'))
      );
    `);
    console.log('Table recreated successfully with updated schema!');
  } catch (e) {
    console.error('Setup failed:', e);
  }
}

setup();
