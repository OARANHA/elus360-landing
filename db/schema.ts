import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const leads = sqliteTable('leads', {
 id:text('id').primaryKey(), nome:text('nome').notNull(), empresa:text('empresa').notNull(), email:text('email').notNull(), telefone:text('telefone').notNull(), createdAt:integer('created_at').notNull(), consentVersion:text('consent_version').notNull()
});
