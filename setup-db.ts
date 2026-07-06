import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function setup() {
  const client = createClient({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN! 
  });

  try {
    console.log('Creating translations table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gloss TEXT NOT NULL,
        pose_url TEXT,
        swr TEXT,
        timestamp INTEGER DEFAULT (strftime('%s','now'))
      );
    `);
    console.log('Table created successfully!');
  } catch (e) {
    console.error('Setup failed:', e);
  }
}

setup();
