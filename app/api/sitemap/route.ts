import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (!fs.existsSync(filePath)) {
      console.error('Sitemap file not found');
      return new NextResponse('Sitemap not found', { status: 404 });
    }
    const sitemapContent = fs.readFileSync(filePath, 'utf8');

    return new NextResponse(sitemapContent, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';