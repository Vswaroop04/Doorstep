import { getProviders } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqProviderLogin = z.object({
  page: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page } = TypeReqProviderLogin.parse(body);

    const providers = await getProviders(page);
    return NextResponse.json(
      {
        providers,
      },
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
