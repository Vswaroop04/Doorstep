import { getProviderById } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqProviderLogin = z.object({
  id: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = TypeReqProviderLogin.parse(body);
    const provider = await getProviderById(id);
    if ("message" in provider) {
      return NextResponse.json({ message: provider.message }, { status: 400 });
    }
    const response = NextResponse.json(
      {
        message: "Provider Fetched Succesfully",
        provider: provider.provider,
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
