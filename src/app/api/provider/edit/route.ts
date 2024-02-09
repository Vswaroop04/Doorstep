import { getSession } from "@/lib/auth";
import { editProvider } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeReqAcceptRequest = z.object({
  slots: z.array(z.string()).optional(),
  offlineDuration: z.number().optional(),
});

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
    const { slots, offlineDuration } = TypeReqAcceptRequest.parse(body);
    const Provider = await editProvider(
      session?.provider.id,
      offlineDuration,
      slots
    );

    if ("message" in Provider) {
      return NextResponse.json(
        { message: Provider.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Provider Edited Succesfully", Provider },
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
