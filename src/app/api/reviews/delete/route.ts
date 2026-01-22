import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const filePath = path.join(process.cwd(), 'src/app/data/reviews.json');
    
    const fileData = fs.readFileSync(filePath, 'utf8');
    let reviews = JSON.parse(fileData || '[]');

    // Filter out the review with the matching ID
    reviews = reviews.filter((rev: any) => rev.id !== id);
    
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}