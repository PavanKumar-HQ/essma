/**
 * Server-side API route that proxies all database mutations.
 * Uses the service role key (server-only) to bypass RLS.
 * The client sends { table, operation, payload, match } and this
 * route performs the actual Supabase operation securely.
 */
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, operation, payload, match, select, rpc, args } = body;
    
    const supabase = getAdminClient();
    
    // Inject organization_id into payload if it exists
    if (payload && !payload.organization_id) {
      payload.organization_id = 'aaaaaaaa-0000-0000-0000-000000000001';
    }

    // RPC call (e.g. update_inventory_stock)
    if (rpc) {
      const { data, error } = await supabase.rpc(rpc, args || {});
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data });
    }

    if (operation === 'insert') {
      const query = supabase.from(table).insert(payload);
      const finalQuery = select ? query.select(select).single() : query.select().single();
      const { data, error } = await finalQuery;
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data });
    }

    if (operation === 'update') {
      const query = supabase.from(table).update(payload);
      if (match) {
        const [col, val] = Object.entries(match)[0];
        const { error } = await (query as any).eq(col, val);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ data: true });
      }
    }

    return NextResponse.json({ error: 'Unknown operation' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
