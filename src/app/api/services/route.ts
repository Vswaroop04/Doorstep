import { getServices } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqGetServices = z.object({
  limit : z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { limit } = TypeReqGetServices.parse(body);
    const services = await getServices(limit);
    return NextResponse.json(
      {
        services,
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
