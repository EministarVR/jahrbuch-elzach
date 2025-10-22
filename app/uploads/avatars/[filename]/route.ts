import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

function getErrorCode(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    // security: disallow path traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'avatars', filename);

    try {
      // Check existence and read
      const data = await fs.readFile(filePath);
      const contentType = getContentType(filePath);
      const bytes = new Uint8Array(data);
      const body = new Blob([bytes], { type: contentType });
      return new NextResponse(body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          // Allow quick revalidation to reflect avatar changes immediately
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    } catch (e: unknown) {
      const code = getErrorCode(e);
      if (code === 'ENOENT' || code === 'ENOTDIR') {
        return new NextResponse('Not Found', { status: 404 });
      }
      console.error('Avatar serve error:', e);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  } catch (err) {
    console.error('Unexpected error serving avatar:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
