import { NextResponse } from "next/server";
import { AuthService } from "../service/auth.service";
import { JWTUtils } from "../auth/jwt";
import { cookies } from "next/headers";

export const AuthController = {
  signup: async (req: Request) => {
    try {
      const { email, password, operatorName } = await req.json();

      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 },
        );
      }

      const user = await AuthService.createUser(email, password, operatorName);

      const token = await JWTUtils.generateToken({
        email: user.email,
        name: operatorName,
      });

      await JWTUtils.setAuthCookie(token);

      return NextResponse.json(
        { message: "OPERATOR_INITIALIZED", userId: user.id },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }
  },
  login: async (req: Request) => {
    try {
      const { email, password } = await req.json();

      const userData = await AuthService.verifyOperator(email, password);

      if (!userData) {
        return NextResponse.json(
          { error: "INVALID_CREDENTIALS" },
          { status: 401 },
        );
      }

      const token = await JWTUtils.generateToken({
        email: userData.email,
        name: userData.operatorName,
      });

      await JWTUtils.setAuthCookie(token);

      return NextResponse.json(
        { message: "LOGIN_SUCCESS", user: userData },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error during login:", error);
      return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
  },
  logout: async () => {
    try {
      await JWTUtils.removeAuthCookie();
      return NextResponse.json({ message: "LOGOUT_SUCCESS" }, { status: 200 });
    } catch (error) {
      console.error("Error during logout:", error);
      return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
    }
  },
  getSession: async (req: Request) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("stellar_session")?.value;

      if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      const payload = await JWTUtils.verifyToken(token);

      if (!payload) {
        return NextResponse.json({ user: null }, { status: 401 });
      }

      return NextResponse.json({ user: payload }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "SESSION_ERROR" }, { status: 500 });
    }
  },
};
