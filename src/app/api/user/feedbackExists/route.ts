import { getSession } from "@/lib/auth";
import { FeedbackExists } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

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
    if (!body.providerId) {
      return NextResponse.json(
        {
          message: "Not Authorized",
        },
        { status: 400 }
      );
    }
    const providerId = body.providerId;
    const userId = session.user.id;
    const feedback = await FeedbackExists(providerId, userId);
    if (feedback) {
      return NextResponse.json({
        success: true,
        message: "Feedback Exists",
      });
    }
    return NextResponse.json({
      success: false,
      message: "Feedback Doesnt Exists",
    });
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
