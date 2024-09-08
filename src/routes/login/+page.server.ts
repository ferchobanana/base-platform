import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { verify } from "@node-rs/argon2";
import { lucia } from "$lib/server/auth";
import { eq } from "drizzle-orm"
import { db } from "$lib/server/db/db";
import { usersTable } from "$lib/server/db/schema";

export const load = (event) => {
    if (event.locals.user) {
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
            return fail(400, { message: "Correo o contraseña incorrectos" })
        }

        // Validaciones para el password
        if (typeof password !== "string" || password.length < 6 || password.length > 255) {
            return fail(400, { message: "Correo o contraseña incorrectos" });
        }

        // const existingUser
        const userResult = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)
        const existingUser = userResult[0]

        // Si el array que se obtiene no contiene ningun elemento, es decir ningun usuario
        if (!existingUser) {
            return fail(400, { message: "Correo o contraseña incorrectos." })
        }

        // Validamos la contraseña con la funcion verify de argon2
        const validPassword = await verify(existingUser.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        // Si la contraseña no es válida
        if (!validPassword) {
            return fail(400, { message: "Correo o contraseña incorrectos." });
        }

        console.log("Hasta aqui se ejecuto")

        // Creamos la sesion y seteamos la cookie
        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });

        redirect(302, "/");

    }

} satisfies Actions

