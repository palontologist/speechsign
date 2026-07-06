import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const translations = sqliteTable('translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transcript: text('transcript').notNull(),
  gloss: text('gloss'),
  poseUrl: text('pose_url'),
  swr: text('swr'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
