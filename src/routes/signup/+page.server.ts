import { redirect, fail } from "@sveltejs/kit"
import type { Actions } from "@sveltejs/kit"
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";

import { lucia } from "$lib/server/auth";
import { db } from "$lib/server/db/db";
import { usersTable } from "$lib/server/db/schema";

export const load = (event) => {
    if (event.locals.user) {
        console.log("Usuario iniciado")
        redirect(302, "/")
    }
    return {}
}

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData()
        const email = formData.get("email")
        const password = formData.get("password")

        // Validaciones para el email
        if (typeof email !== "string" || email.length < 5) {
            return fail(400, { message: "Email inválido" })
        }

        // Validaciones para el password
        if (typeof password !== "string" || password.length < 6 || password.length > 255) {
            return fail(400, { message: "Contraseña inválida" });
        }

        // Creamos un nuevo userID y un hash password
        const userId = generateIdFromEntropySize(10); // 16 characters long
        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        // GuArdamos el nuevo usuario en la DB
        try {
            await db.insert(usersTable).values({
                id: userId,
                email: email,
                password: passwordHash
            })
        }
        // Si el email ya esta en uso o hay algun error
        catch {
            return fail(400, { message: "Email inválido, intenta con otro" })
        }

        // Creamos la sesion y gurdamos el ID de la sesion en la cookie
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        // Redirigimos
        redirect(302, "/tutorial")
    }

} satisfies Actions