import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

const ALLOWED_BUCKETS = ['logos', 'screenshots', 'covers', 'project-images', 'media'] as const;
type Bucket = (typeof ALLOWED_BUCKETS)[number];

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB pre-compression cap

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const isDownload = request.nextUrl.searchParams.get('list') === 'true';
  if (isDownload) {
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="media-list-${Date.now()}.json"`,
      },
    });
  }

  return NextResponse.json({ media: data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const bucketInput = formData.get('bucket');
  const usageType = (formData.get('usageType') as string) ?? 'general';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (typeof bucketInput !== 'string' || !ALLOWED_BUCKETS.includes(bucketInput as Bucket)) {
    return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File exceeds the 8MB upload limit' }, { status: 400 });
  }

  const bucket = bucketInput as Bucket;
  const originalBuffer = Buffer.from(await file.arrayBuffer());

  // Compress and normalize to webp for consistent, small file sizes,
  // except SVGs (icons/logos), which pass through untouched.
  let outputBuffer: Buffer = originalBuffer;
  let contentType = file.type;
  let extension = file.name.split('.').pop() || 'bin';

  if (file.type !== 'image/svg+xml') {
    try {
      outputBuffer = Buffer.from(
        await sharp(originalBuffer)
          .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer()
      );
      contentType = 'image/webp';
      extension = 'webp';
    } catch {
      // If sharp fails to process (corrupt/unsupported image), fall back
      // to storing the original bytes rather than failing the upload.
    }
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `${usageType}/${Date.now()}-${safeName.replace(/\.[^.]+$/, '')}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, outputBuffer, {
    contentType,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

  const { data: mediaRecord, error: dbError } = await supabase
    .from('media_assets')
    .insert({
      file_name: safeName,
      storage_path: `${bucket}/${path}`,
      public_url: publicUrlData.publicUrl,
      mime_type: contentType,
      size_bytes: outputBuffer.byteLength,
      usage_type: usageType,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  await logActivity('uploaded', 'media', mediaRecord.id, safeName);
  return NextResponse.json({ media: mediaRecord }, { status: 201 });
}
