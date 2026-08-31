import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware de proteccion del panel admin.
 *
 * Protege todas las rutas /admin excepto /admin/login. Si no hay una cookie de
 * sesion valida, redirige al login. La verificacion del JWT se hace aqui en el
 * edge (sin acceso a Node crypto), por eso usamos jose directamente.
 */

const COOKIE_NAME = "resplandecer_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "";
  return new TextEncoder().encode(secret);
}

async function tieneSesionValida(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El login es publico.
  if (pathname === "/admin/login") {
    // Si ya tiene sesion, mandarlo al panel.
    if (await tieneSesionValida(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Resto de /admin requiere sesion.
  if (!(await tieneSesionValida(request))) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
