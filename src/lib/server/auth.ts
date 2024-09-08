import { Lucia } from "lucia"
import { dev } from "$app/environment"
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { db } from "./db/db"
import { usersTable, sessionsTable } from "./db/schema"

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (user) => {
		return {
			id: user.id,
			userName: user.userName,
			email: user.email,
			type: user.type
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	userName: string;
	email: string;
	type: string;
}