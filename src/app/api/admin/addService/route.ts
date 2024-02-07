import { getSession } from "@/lib/auth";
import { addService } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const TypeAddServiceReq = z.object({
  serviceName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceName } = TypeAddServiceReq.parse(body);
    const session = await getSession();
    if (!session.admin) {
      return Response.json(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    const service = await addService(serviceName);
    return NextResponse.json(
      {
        message: "Service Added Succesfully",
        service,
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
