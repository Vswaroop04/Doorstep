import { getSession } from "@/lib/auth";
import { offlineMeetingReqToUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqAcceptRequest = z.object({
  userId: z.string(),
  offlinePrice: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.provider) {
      return Response.json(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { userId, offlinePrice } = TypeReqAcceptRequest.parse(body);
    const approvedMeeting = await offlineMeetingReqToUser(
      session?.provider?.id,
      userId,
      offlinePrice
    );

    if ("message" in approvedMeeting) {
      return NextResponse.json(
        { message: approvedMeeting.message },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Error in sending req" },
      { status: 400 }
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
