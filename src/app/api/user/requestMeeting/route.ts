import { getSession } from "@/lib/auth";
import { scheduleMeetingWithProvider } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqMeeting = z.object({
  slotId: z.string(),
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
    const { slotId } = TypeReqMeeting.parse(body);
    const userId = session.user.id;
    const onlineSchedule = await scheduleMeetingWithProvider(slotId,userId);
    return NextResponse.json(
      {
        message: `Online Meeting Succesfully Scheduled With User`,
        onlineSchedule,
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
