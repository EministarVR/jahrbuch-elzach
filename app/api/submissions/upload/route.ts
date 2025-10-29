import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const fileEntry = form.get('file');
  if (!(fileEntry instanceof Blob)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const file = fileEntry as Blob;
  const type = file.type;
  const isImage = IMAGE_TYPES.has(type);
  const isVideo = VIDEO_TYPES.has(type);

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  const size = file.size;
  if (isImage && size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 });
  }
  if (isVideo && size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'Video too large (max 60MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const timestamp = Date.now();
  const ext = (() => {
    if (type === 'image/png') return '.png';
    if (type === 'image/webp') return '.webp';
    if (type === 'image/gif') return '.gif';
    if (type === 'image/jpeg') return '.jpg';
    if (type === 'video/mp4') return '.mp4';
    if (type === 'video/webm') return '.webm';
    if (type === 'video/quicktime') return '.mov';
    return '';
  })();

  const fileName = `${session.userId}-${timestamp}${ext}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'submissions');
  await fs.mkdir(uploadsDir, { recursive: true });
  const absPath = path.join(uploadsDir, fileName);
  await fs.writeFile(absPath, buffer);

  const url = `/uploads/submissions/${fileName}`;

  const media_type: 'image' | 'gif' | 'video' = type === 'image/gif' ? 'gif' : (isVideo ? 'video' : 'image');

  return NextResponse.json({
    success: true,
    url,
    media_type,
    mime: type,
    thumb_url: null as string | null,
    width: null as number | null,
    height: null as number | null,
    duration_ms: null as number | null,
  });
}
