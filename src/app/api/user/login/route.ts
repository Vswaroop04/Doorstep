import { getUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";

const TypeReqUserLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = TypeReqUserLogin.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await getUser(email, hashedPassword);
    if ("message" in user) {
      return NextResponse.json({ message: user.message }, { status: 400 });
    }
    const session = await encrypt({ payload: user.user });

    const response = NextResponse.json(
      { message: "User Logged In Succesfully", user },
      { status: 200 }
    );
    response.cookies.set({
      name: "session",
      value: session,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
