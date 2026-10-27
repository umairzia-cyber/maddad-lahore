import { NextRequest, NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase";
import { isProd, cronSecret } from "@/lib/config";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser().catch(() => null);
    const secretParam = req.nextUrl.searchParams.get("secret");
    const isPrivileged = (!isProd) || (user?.is_admin === true) || Boolean(cronSecret && secretParam === cronSecret);

    const health = await testSupabaseConnection();

    if (!isPrivileged) {
      return NextResponse.json({
        status: health.connected ? "connected" : "not_connected",
        configured: health.configured,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ...health,
    });
  } catch (err) {
    return NextResponse.json(
      {
        configured: false,
        connected: false,
        error: isProd ? "Internal check failed" : (err instanceof Error ? err.message : String(err)),
      },
      { status: 500 },
    );
  }
}
