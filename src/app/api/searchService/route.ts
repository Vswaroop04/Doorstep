import { searchService } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TypeSearchService = z.object({
  serviceName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceName } = TypeSearchService.parse(body);
    const services = await searchService(serviceName);
    return NextResponse.json(
      {
        services,
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
