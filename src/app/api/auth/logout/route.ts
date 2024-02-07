import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    message: "NextJs API running successfully",
  });
  response.cookies.delete("session");

  return response;
}
