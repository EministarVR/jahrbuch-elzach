import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  const userIdRaw = form.get('userId');
  const userId = Number(typeof userIdRaw === 'string' ? userIdRaw : (typeof userIdRaw === 'number' ? userIdRaw : 0));

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  const f = file as Blob;

  const type = f.type;
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  if (f.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const arrayBuffer = await f.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compute filename using target user id
  const ext = type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : type === 'image/gif' ? '.gif' : '.jpg';
  const timestamp = Date.now();
  const fileName = `${userId}-${timestamp}${ext}`;

  // Ensure directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/avatars/${fileName}`;

  return NextResponse.json({ success: true, url: publicUrl });
}
