import { insertNewUser, TypeUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";

const TypeReqProviderSignUp = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  lat: z.number(),
  long: z.number(),
  offlineDuration: z.number(),
  mobile: z.number().refine((value) => /^\d{10}$/.test(value.toString()), {
    message: "Invalid mobile number",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userReq = body as TypeUser;
    userReq.password = await bcrypt.hash(userReq.password, 10);
    const UserArr = await insertNewUser(userReq);
    const user = UserArr[0];
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user });

    const { password, ...userWithoutPwd } = user;
    const response = NextResponse.json(
      {
        message: "User Created Successfully",
        user: userWithoutPwd,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "session",
      expires,
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
