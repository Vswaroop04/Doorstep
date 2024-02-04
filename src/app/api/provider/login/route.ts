import { getProvider } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const TypeReqProviderLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = TypeReqProviderLogin.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = await getProvider(email, hashedPassword);
    if ("message" in provider) {
      return NextResponse.json({ message: provider.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Provider Logged In Succesfully", provider },
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
