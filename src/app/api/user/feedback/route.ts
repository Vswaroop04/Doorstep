import { getSession } from "@/lib/auth";
import { userFeedback, TypeUserFeedback } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.user) {
      return Response.json(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    body.userId = session.user.id;
    const feedbackBodyReq = body as TypeUserFeedback;
    const feedback = await userFeedback(feedbackBodyReq);
    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
