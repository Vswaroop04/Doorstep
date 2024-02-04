import { insertNewProvider } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "@/lib/auth";

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

function removeSensitiveFields(provider: any) {
  const { password, ...rest } = provider;
  return rest;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = TypeReqProviderSignUp.parse(body);
    const hashedPassword = await bcrypt.hash(provider.password, 10);
    const { password, ...withoutpwdprovider } = provider;
    const Provider = await insertNewProvider({
      ...withoutpwdprovider,
      password: hashedPassword,
    });
    if ("message" in Provider) {
      return NextResponse.json({ message: Provider.message }, { status: 400 });
    }
    const token = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(getJwtSecretKey()));
    const response = NextResponse.json(
      {
        message: "Provider Created Successfully",
        Provider: removeSensitiveFields(Provider),
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "Provider-token",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60,
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
