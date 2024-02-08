import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    message: "Logged Out successfully",
  });
  response.cookies.delete("session");

  return response;
}
