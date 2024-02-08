import { getSlots } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TyoeReqGetSlots = z.object({
  providerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { providerId } = TyoeReqGetSlots.parse(body);

    const slots = await getSlots(providerId);
    return NextResponse.json(
      {
        slots,
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
  