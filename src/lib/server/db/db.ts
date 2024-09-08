import { drizzle } from "drizzle-orm/postgres-js"
import { sql } from "drizzle-orm"
import postgres from "postgres"
import { POSTGRES_URL } from '$env/static/private';

const pgClient = postgres(POSTGRES_URL)
export const db = drizzle(pgClient)

await db.execute(sql`SET TIME ZONE 'America/Mexico_City'`)