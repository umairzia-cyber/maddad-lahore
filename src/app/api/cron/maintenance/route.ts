import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { runMaintenance } from "@/lib/maintenance";
import { cronSecret } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!cronSecret) {
    return new NextResponse("Cron endpoint is disabled (CRON_SECRET not configured).", {
      status: 403,
    });
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "") || req.nextUrl.searchParams.get("secret");

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const a = Buffer.from(token);
  const b = Buffer.from(cronSecret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await runMaintenance();
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Maintenance failed" }, { status: 500 });
  }
}
