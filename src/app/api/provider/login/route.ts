import { getProvider } from "@/lib/routes";
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
    const provider = await getProvider(email, password);
    if ("message" in provider) {
      return NextResponse.json({ message: provider.message }, { status: 400 });
    }
    const session = await encrypt({ provider : provider.provider.id });
    const response = NextResponse.json(
      {
        message: "Provider Logged In Succesfully",
        provider: provider.provider,
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
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
