import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const translations = sqliteTable('translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gloss: text('gloss').notNull(),
  poseUrl: text('pose_url'),
  swr: text('swr'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
