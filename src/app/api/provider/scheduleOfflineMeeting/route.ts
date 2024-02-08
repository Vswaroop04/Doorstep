import { getSession } from "@/lib/auth";
import {
  scheduleOfflineMeetingWithProvider,
  TypeOfflineSchedules,
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
    body.providerId = session.provider.id;
    const offlineMeetingObj = body as TypeOfflineSchedules;
    const offlineSchedule = await scheduleOfflineMeetingWithProvider(
      offlineMeetingObj
    );
    return NextResponse.json(
      {
        message: `Offline Meeting Succesfully Scheduled With User`,
        offlineSchedule,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
