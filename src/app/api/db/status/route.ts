import { NextResponse } from "next/server";
import { isPostgresAvailable, pool, q } from "@/lib/db";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const pg = await isPostgresAvailable();
  const dbUrlSet = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("kaam_local_dev_only"));

  let connectionError: string | null = null;
  if (!pg && dbUrlSet) {
    try {
      const client = await pool().connect();
      await client.query("SELECT 1");
      client.release();
    } catch (err) {
      connectionError = err instanceof Error ? err.message : String(err);
    }
  }

  let counts = { jobs: 0, users: 0, bids: 0 };
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

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    postgresAvailable: pg,
    storageMode: pg ? "production_postgres" : "in_memory_fallback",
    databaseUrlConfigured: dbUrlSet,
    connectionError,
    supportEmailConfigured: Boolean(process.env.SUPPORT_EMAIL),
    counts,
    message: pg
      ? "Connected to persistent PostgreSQL database."
      : "Running in-memory fallback store. To enable persistent PostgreSQL in production, add DATABASE_URL in Vercel Environment Variables.",
  });
}
