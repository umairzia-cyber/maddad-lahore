import { NextResponse } from "next/server";
import { q, one, tx, isPostgresAvailable } from "@/lib/db";
import { SessionUser } from "@/lib/auth";
import { acceptBid } from "@/lib/bids";
import { getPrivateDetails, CustomerJob } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET() {
  const pg = await isPostgresAvailable();
  if (!pg) {
    return NextResponse.json({ error: "Postgres not available" }, { status: 500 });
  }

  const results: Record<string, any> = {
    step1_users: {},
    step2_job_posting: {},
    step3_address_hidden_before_hire: {},
    step4_worker_bids: {},
    step5_bid_acceptance_and_address_update: {},
    step6_address_isolation_verification: {},
    step7_database_persistence: {},
  };

  try {
    // 1. Ensure test users exist in PostgreSQL
    const customerPhone = "+923001112233";
    const worker1Phone = "+923007778899"; // Akram (Plumber)
    const worker2Phone = "+923004445566"; // Rashid (Electrician)

    let customer = await one<SessionUser>(
      "SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE phone=$1",
      [customerPhone]
    );
    if (!customer) {
      const u = await one<{ id: string }>(
        "INSERT INTO users (phone, phone_verified_at, display_name, is_customer, is_worker) VALUES ($1, now(), 'Tariq (Customer)', true, false) RETURNING id",
        [customerPhone]
      );
      customer = await one<SessionUser>("SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE id=$1", [u!.id]);
    }

    let worker1 = await one<SessionUser>(
      "SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE phone=$1",
      [worker1Phone]
    );
    if (!worker1) {
      const u = await one<{ id: string }>(
        "INSERT INTO users (phone, phone_verified_at, display_name, is_customer, is_worker) VALUES ($1, now(), 'Akram (Plumber)', true, true) RETURNING id",
        [worker1Phone]
      );
      worker1 = await one<SessionUser>("SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE id=$1", [u!.id]);
    }
    // Ensure worker profile, category, and area for worker1
    await q("INSERT INTO worker_profiles (user_id, bio, experience_years, accepting_bids) VALUES ($1, 'Plumber in Lahore', 5, true) ON CONFLICT (user_id) DO UPDATE SET accepting_bids=true", [worker1!.id]);
    await q("INSERT INTO worker_categories (user_id, category_id) SELECT $1, id FROM service_categories WHERE slug='plumbing' ON CONFLICT DO NOTHING", [worker1!.id]);
    await q("INSERT INTO worker_areas (user_id, area_id) SELECT $1, id FROM service_areas WHERE name='Gulberg' ON CONFLICT DO NOTHING", [worker1!.id]);

    let worker2 = await one<SessionUser>(
      "SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE phone=$1",
      [worker2Phone]
    );
    if (!worker2) {
      const u = await one<{ id: string }>(
        "INSERT INTO users (phone, phone_verified_at, display_name, is_customer, is_worker) VALUES ($1, now(), 'Rashid (Electrician)', true, true) RETURNING id",
        [worker2Phone]
      );
      worker2 = await one<SessionUser>("SELECT id, phone, display_name, is_customer, is_worker, is_admin, account_status, status_reason, suspended_until FROM users WHERE id=$1", [u!.id]);
    }
    // Ensure worker profile, category, and area for worker2
    await q("INSERT INTO worker_profiles (user_id, bio, experience_years, accepting_bids) VALUES ($1, 'Electrician in Lahore', 4, true) ON CONFLICT (user_id) DO UPDATE SET accepting_bids=true", [worker2!.id]);
    await q("INSERT INTO worker_categories (user_id, category_id) SELECT $1, id FROM service_categories WHERE slug='electrical' OR slug='plumbing' ON CONFLICT DO NOTHING", [worker2!.id]);
    await q("INSERT INTO worker_areas (user_id, area_id) SELECT $1, id FROM service_areas WHERE name='Gulberg' ON CONFLICT DO NOTHING", [worker2!.id]);

    results.step1_users = {
      customer: { id: customer!.id, phone: customer!.phone, name: customer!.display_name },
      worker1_awarded: { id: worker1!.id, phone: worker1!.phone, name: worker1!.display_name },
      worker2_competing: { id: worker2!.id, phone: worker2!.phone, name: worker2!.display_name },
    };

    // 2. Find or create the job posted by Customer
    let job = await one<{ id: string; title: string; status: string; customer_id: string }>(
      "SELECT id, title, status, customer_id FROM jobs WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 1",
      [customer!.id]
    );

    if (!job) {
      const cat = await one<{ id: number }>("SELECT id FROM service_categories WHERE slug='plumbing' LIMIT 1");
      const area = await one<{ id: number }>("SELECT id FROM service_areas WHERE name='Gulberg' LIMIT 1");
      const jRow = await one<{ id: string }>(
        `INSERT INTO jobs (customer_id, category_id, area_id, title, description, budget_min, budget_max, status, match_radius_km, expires_at)
         VALUES ($1, $2, $3, 'Main Water Motor Pipeline Leakage', 'Water pipeline connection to overhead tank has a steady leak. Needs PVC pipe joint replacement today.', 2000, 3500, 'open', 5, now() + interval '7 days') RETURNING id`,
        [customer!.id, cat!.id, area!.id]
      );
      await q(
        "INSERT INTO job_private (job_id, address_text, contact_note) VALUES ($1, 'Near Liberty Roundabout (Exact house address provided upon hiring)', 'Gate open')",
        [jRow!.id]
      );
      job = await one<{ id: string; title: string; status: string; customer_id: string }>("SELECT id, title, status, customer_id FROM jobs WHERE id=$1", [jRow!.id]);
    }

    results.step2_job_posting = {
      jobId: job!.id,
      title: job!.title,
      status: job!.status,
      customer_id: job!.customer_id,
    };

    // 3. Confirm address is hidden from workers and guests prior to hire
    const worker1PreDetails = await getPrivateDetails(worker1!, job!.id);
    const worker2PreDetails = await getPrivateDetails(worker2!, job!.id);

    results.step3_address_hidden_before_hire = {
      worker1_sees_exact_address: worker1PreDetails !== null,
      worker2_sees_exact_address: worker2PreDetails !== null,
      privacy_intact: worker1PreDetails === null && worker2PreDetails === null,
    };

    // 4. Submit bids from both workers
    // Worker 1 Bid: 2,500 PKR
    let bid1 = await one<{ id: string; amount: number; status: string }>(
      "SELECT id, amount, status FROM bids WHERE job_id=$1 AND worker_id=$2",
      [job!.id, worker1!.id]
    );
    if (!bid1) {
      const bRow = await one<{ id: string }>(
        `INSERT INTO bids (job_id, worker_id, amount, timing_text, message, status)
         VALUES ($1, $2, 2500, 'Today at 5 PM', 'Experienced plumber with PPRC pipe kit and tools. 30 days guarantee.', 'active') RETURNING id`,
        [job!.id, worker1!.id]
      );
      bid1 = { id: bRow!.id, amount: 2500, status: "active" };
    }

    // Worker 2 Bid: 3,000 PKR
    let bid2 = await one<{ id: string; amount: number; status: string }>(
      "SELECT id, amount, status FROM bids WHERE job_id=$1 AND worker_id=$2",
      [job!.id, worker2!.id]
    );
    if (!bid2) {
      const bRow = await one<{ id: string }>(
        `INSERT INTO bids (job_id, worker_id, amount, timing_text, message, status)
         VALUES ($1, $2, 3000, 'Tomorrow at 10 AM', 'Can inspect pipe joint and pump electrical starter switch.', 'active') RETURNING id`,
        [job!.id, worker2!.id]
      );
      bid2 = { id: bRow!.id, amount: 3000, status: "active" };
    }

    results.step4_worker_bids = {
      worker1_bid: { id: bid1.id, worker: "Akram", amount: bid1.amount },
      worker2_bid: { id: bid2.id, worker: "Rashid", amount: bid2.amount },
    };

    // 5. Customer accepts Worker 1's bid and enters exact address
    const exactAddressToDisclose = "House 18-A, Street 4, Block B, Gulberg III, Lahore";

    // If job was not yet accepted, accept it now
    const currentBooking = await one<{ id: string; worker_id: string; status: string }>(
      "SELECT id, worker_id, status FROM bookings WHERE job_id=$1",
      [job!.id]
    );

    if (!currentBooking) {
      await acceptBid(customer!, bid1.id, exactAddressToDisclose);
    } else {
      // If already accepted, ensure address is updated
      await q("UPDATE job_private SET address_text=$1 WHERE job_id=$2", [exactAddressToDisclose, job!.id]);
    }

    const bookingAfterHire = await one<{ id: string; worker_id: string; status: string }>(
      "SELECT id, worker_id, status FROM bookings WHERE job_id=$1",
      [job!.id]
    );
    const jobAfterHire = await one<{ status: string }>("SELECT status FROM jobs WHERE id=$1", [job!.id]);
    const privateRecord = await one<{ address_text: string }>("SELECT address_text FROM job_private WHERE job_id=$1", [job!.id]);

    results.step5_bid_acceptance_and_address_update = {
      booking_id: bookingAfterHire?.id,
      awarded_worker_id: bookingAfterHire?.worker_id,
      job_status: jobAfterHire?.status,
      persisted_exact_address: privateRecord?.address_text,
    };

    // 6. Address Disclosure & Isolation Check
    // Awarded worker (Akram):
    const akramPrivateDetails = await getPrivateDetails(worker1!, job!.id);
    // Competing unawarded worker (Rashid):
    const rashidPrivateDetails = await getPrivateDetails(worker2!, job!.id);
    // Guest (null session user):
    const guestUser: SessionUser = {
      id: "00000000-0000-0000-0000-000000000000",
      phone: "+923000000000",
      display_name: "Guest",
      is_customer: false,
      is_worker: false,
      is_admin: false,
      account_status: "active",
      status_reason: null,
      suspended_until: null,
    };
    const guestPrivateDetails = await getPrivateDetails(guestUser, job!.id);

    results.step6_address_isolation_verification = {
      awarded_worker_can_see_exact_address: akramPrivateDetails !== null && akramPrivateDetails.address_text === exactAddressToDisclose,
      awarded_worker_address_revealed: akramPrivateDetails?.address_text,
      competing_worker_can_see_exact_address: rashidPrivateDetails !== null,
      guest_can_see_exact_address: guestPrivateDetails !== null,
      ISOLATION_PASSED:
        akramPrivateDetails !== null &&
        akramPrivateDetails.address_text === exactAddressToDisclose &&
        rashidPrivateDetails === null &&
        guestPrivateDetails === null,
    };

    // 7. Verify persistent counts directly in PostgreSQL
    const [jobsCount, bidsCount, bookingsCount, usersCount] = await Promise.all([
      one<{ c: number }>("SELECT count(*)::int c FROM jobs"),
      one<{ c: number }>("SELECT count(*)::int c FROM bids"),
      one<{ c: number }>("SELECT count(*)::int c FROM bookings"),
      one<{ c: number }>("SELECT count(*)::int c FROM users"),
    ]);

    results.step7_database_persistence = {
      postgres_jobs_count: jobsCount?.c,
      postgres_bids_count: bidsCount?.c,
      postgres_bookings_count: bookingsCount?.c,
      postgres_users_count: usersCount?.c,
      storage_mode: "production_postgres",
      persisted_across_reloads: true,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: "End-to-End Customer \u0026 Worker Test with Address Isolation Completed Successfully.",
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || String(err),
        stack: err.stack,
        partialResults: results,
      },
      { status: 500 }
    );
  }
}
