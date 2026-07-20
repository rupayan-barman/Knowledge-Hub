import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const reorderSchema = z.object({
  order: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })),
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const updates = await Promise.all(
    parsed.data.order.map(({ id, sort_order }) =>
      supabase.from('categories').update({ sort_order }).eq('id', id)
    )
  );

  const failed = updates.find((u) => u.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
