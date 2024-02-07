import { insertNewProvider } from "@/lib/routes";
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
    const providerObj = Provider[0];
    if ("message" in Provider) {
      return NextResponse.json({ message: Provider.message }, { status: 400 });
    }
    // Calculating the expiry time (1 day from now)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ providerObj, expires });

    const response = NextResponse.json(
      {
        message: "Provider Created Successfully",
        Provider: removeSensitiveFields(Provider),
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
