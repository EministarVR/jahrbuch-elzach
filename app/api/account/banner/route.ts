import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  const f = fileEntry as Blob;

  const type = f.type;
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  if (f.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  const arrayBuffer = await f.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compute filename
  const ext = type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : type === 'image/gif' ? '.gif' : '.jpg';
  const timestamp = Date.now();
  const fileName = `${session.userId}-${timestamp}${ext}`;

  // Ensure directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/banners/${fileName}`;

  return NextResponse.json({ success: true, url: publicUrl });
}
