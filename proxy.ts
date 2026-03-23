import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "cheie-secreta-de-rezerva-123456"
);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("stellar_session")?.value; 
  const { pathname } = req.nextUrl;


  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    if (token) {
      try {
        await jwtVerify(token, SECRET);
   
        return NextResponse.redirect(new URL("/", req.url));
      } catch (e) {

        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }


  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch (error) {

    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("stellar_session"); 
    return response;
  }
}

export const config = {

  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};