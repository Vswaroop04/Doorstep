import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    const Payload = await getSession();
  if (Payload) {
    const response = NextResponse.json({
      message: "Authorized",
      Payload
    });

    return response;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
}
