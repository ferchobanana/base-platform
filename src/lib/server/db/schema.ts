import { pgTable, serial, varchar, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core"

export const usersTable = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').unique(),
    userName: varchar('user_name', { length: 50 }),
    password: text('password'),
    type: text('type'),
    data: jsonb('data'),
    urlProfilePicture: text('url_profile_picture'),
    createdAt: timestamp('created_at').defaultNow()
})

export const sessionsTable = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => usersTable.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: "date"
    }).notNull()
})