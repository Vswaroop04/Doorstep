import { createSlots, getAllProviderIds } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
        const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const providerIds = await getAllProviderIds();
    const promises = providerIds.map((providerId) => createSlots(providerId));

    await Promise.all(promises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating slots:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic"