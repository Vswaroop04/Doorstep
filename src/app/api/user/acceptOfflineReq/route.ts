import { getSession } from "@/lib/auth";
import { approveOfflineReq, offlineMeetingReqToUser } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqAcceptRequest = z.object({
    id: z.string(),
    status : z.string()
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return Response.json(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { id,status } = TypeReqAcceptRequest.parse(body);
    const approvedMeeting = await approveOfflineReq(id,status);

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
