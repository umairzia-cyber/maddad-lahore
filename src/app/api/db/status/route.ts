import { NextRequest, NextResponse } from "next/server";
import { isPostgresAvailable, pool, q } from "@/lib/db";
import { store } from "@/lib/store";
import { isProd, cronSecret } from "@/lib/config";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pg = await isPostgresAvailable();
  const dbUrlSet = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("kaam_local_dev_only"));

  let connectionError: string | null = null;
  if (!pg && dbUrlSet) {
    try {
      const client = await pool().connect();
      await client.query("SELECT 1");
      client.release();
    } catch (err) {
      // In production, never leak raw connection string or internal network errors to public callers
      connectionError = isProd ? "Database unreachable" : (err instanceof Error ? err.message : String(err));
    }
  }

  // Check if caller is authenticated admin for detailed telemetry
  const user = await getUser().catch(() => null);
  const secretParam = req.nextUrl.searchParams.get("secret");
  const isPrivileged = (!isProd) || (user?.is_admin === true) || Boolean(cronSecret && secretParam === cronSecret);

  let counts = { jobs: 0, users: 0, bids: 0 };
  if (isPrivileged) {
    if (pg) {
      try {
        const [j, u, b] = await Promise.all([
          q<{ c: number }>("SELECT count(*)::int c FROM jobs"),
          q<{ c: number }>("SELECT count(*)::int c FROM users"),
          q<{ c: number }>("SELECT count(*)::int c FROM bids"),
        ]);
        counts = { jobs: j[0]?.c ?? 0, users: u[0]?.c ?? 0, bids: b[0]?.c ?? 0 };
      } catch {
        // ignore
      }
    } else {
      counts = {
        jobs: store.jobs.size,
        users: store.users.size,
        bids: store.bids.size,
      };
    }
  }

  return NextResponse.json({
    status: pg ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    postgresAvailable: pg,
    storageMode: pg ? "production_postgres" : "in_memory_fallback",
    ...(isPrivileged ? {
      databaseUrlConfigured: dbUrlSet,
      connectionError,
      supportEmailConfigured: Boolean(process.env.SUPPORT_EMAIL),
      counts,
      message: pg
        ? "Connected to persistent PostgreSQL database."
        : "Running in-memory fallback store. To enable persistent PostgreSQL in production, add DATABASE_URL in Vercel Environment Variables.",
    } : {}),
  });
}
