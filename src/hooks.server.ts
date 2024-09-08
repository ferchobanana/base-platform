import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Obtenemos la cookie con el ID de la sesion
	const sessionId = event.cookies.get(lucia.sessionCookieName);

    // Si no hay cookie
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

    // Validamos si existe una sesion con el ID guardado en la cookie
	const { session, user } = await lucia.validateSession(sessionId);

    // Si existe una sesion pero fress es true, se extendio la fecha de expiracion de la sesion
    // entonces tenemos que renovar la cookie
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}

    // Si no se valida la sesion con el ID de la cookie, se resetea la cookie
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
	}

    // Se guardan los valores del usuario y la sesión que estarán disponibles en:
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};