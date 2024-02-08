import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const Payload = await getSession();
  if (Payload.provider) {
    const response = NextResponse.json({
      message: "Authorized",
      provider: Payload.provider,
    });

    return response;
  }
  if (Payload.user) {
    const response = NextResponse.json({
      message: "Authorized",
      user: Payload.user,
    });

    return response;
  }
  if (Payload.admin) {
    const response = NextResponse.json({
      message: "Authorized",
      admin: Payload.admin,
    });

    return response;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
}
