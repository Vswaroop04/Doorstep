import { getSession } from "@/lib/auth";
import { getFeedback } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const TypeAddFeedbacksReq = z.object({
  providerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { providerId } = TypeAddFeedbacksReq.parse(body);
    const session = await getSession();
    if (!session?.admin) {
      return Response.json(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    const Feedbacks = await getFeedback(providerId);
    return NextResponse.json(
      {
        message: "Feedbacks Fetched Succesfully",
        Feedbacks,
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
