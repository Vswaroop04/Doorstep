import { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth";

export default async function middleware(req: NextRequest) {
  let token = req.cookies.get("Provider-token")?.value;

  const verifiedToken =
    token &&
    (await verifyAuth(token).catch((err) => {
      console.log(err);
    }));

  if (verifiedToken) return;
  return Response.json(
    { success: false, message: "Not Authorized" },
    { status: 401 }
  );
}

export const config = {
  matcher: [
    "/api/provider/acceptRequest",
    "/api/provider",
    "/api/user/feedback",
    "/api/user/requestMeeting",
  ],
};
