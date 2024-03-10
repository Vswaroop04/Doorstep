import { getSession } from "@/lib/auth";
import {
  scheduleOfflineMeetingWithProvider,
  TypeOfflineSchedules,
  updateStatusOfflineSchedule,
} from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

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
    const offlineMeetingObj = body as { id: string; status: string };
    const offlineSchedule = await updateStatusOfflineSchedule(
      offlineMeetingObj.id,
      offlineMeetingObj.status
    );
    return NextResponse.json(
      {
        message: `Offline Meeting Succesfully Scheduled With User`,
        offlineSchedule,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
