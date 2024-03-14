import { getSession } from "@/lib/auth";
import { approveMeetingWithCustomer } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqAcceptRequest = z.object({
  meetingId: z.string(),
  slotId: z.string(),
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
    const { meetingId, slotId } = TypeReqAcceptRequest.parse(body);
    const approvedMeeting = await approveMeetingWithCustomer(
      slotId,
      meetingId,
      session?.provider?.onlinePrice);

    if ("message" in approvedMeeting) {
      return NextResponse.json(
        { message: approvedMeeting.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Meeting Approved Succesfully", approvedMeeting },
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
