import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";

const TypeReqProviderLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = TypeReqProviderLogin.parse(body);
    if (
      email == process.env.ADMIN_MAIL &&
      password == process.env.ADMIN_MAIL
    ) {
      const session = await encrypt({
        payload: { admin: { name: "DoorStep", email: process.env.ADMIN_MAIL } },
      });
      const response = NextResponse.json(
        {
          message: "Admin Logged In Succesfully",
        },
        { status: 200 }
      );

      response.cookies.set({
        name: "session",
        value: session,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      return response;
      }
      return NextResponse.json(
        {
          message: "Invalid Credentials",
        },
        { status: 401 }
      );
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
