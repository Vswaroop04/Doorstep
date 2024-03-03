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
  serviceName: z.string(),
  long: z.number(),
  onlinePrice: z.number(),
  offlinePrice: z.number(),
  mobile: z.number(),
  slots: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providerUbj = TypeReqProviderSignUp.parse(body);
    const hashedPassword = await bcrypt.hash(providerUbj.password, 10);
    const { password: removedpwd, ...withoutpwdprovider } = providerUbj;
    const Provider = await insertNewProvider({
      ...withoutpwdprovider,
      slotsArray: providerUbj.slots,
      password: hashedPassword,
      offlineDuration: 2,
    });
    const providerWithPwd = Provider[0];
    if ("message" in Provider) {
      return NextResponse.json({ message: Provider.message }, { status: 400 });
    }
    // Calculating the expiry time (1 day from now)
    const { password, ...provider } = providerWithPwd;

    const response = NextResponse.json(
      {
        message: "Provider Created Successfully",
        provider,
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
