import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
  const client = createClient({ 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN! 
  });
  const db = drizzle(client);

  try {
    const result = await client.execute("SELECT 1");
    console.log('Connection successful:', result);
  } catch (e) {
    console.error('Connection failed:', e);
  }
}

test();
