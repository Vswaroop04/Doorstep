import { insertNewUser, TypeUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userReq = body as TypeUser;
    userReq.password = await bcrypt.hash(userReq.password, 10);
    const UserArr = await insertNewUser(userReq);
    const user = UserArr[0];
    const { password, ...userWithoutPwd } = user;
    const response = NextResponse.json(
      {
        message: "User Created Successfully",
        user: userWithoutPwd,
      },
      { status: 200 }
    );

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
