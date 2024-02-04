import { getUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

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
    return NextResponse.json(
      { message: "User Logged In Succesfully", user },
      { status: 200 }
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
