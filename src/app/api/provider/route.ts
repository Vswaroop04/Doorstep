import { getProviders } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqProviderLogin = z.object({
  page: z.number(),
  sort: z
    .object({
      rating: z.number().min(-1).max(1).optional(),
      distance: z.number().min(-1).max(1).optional(),
    })
    .optional(),
  serviceName: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, sort, serviceName, lat, long } = TypeReqProviderLogin.parse(body);

    const providers = await getProviders(page, serviceName, sort, lat, long);
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
