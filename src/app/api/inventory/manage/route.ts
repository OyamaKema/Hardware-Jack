import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { action, id, updatedProduct } = await req.json();
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'inventory.json');
    let inventory = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');

    if (action === 'DELETE') {
      inventory = inventory.filter((p: any) => p.id !== id);
    } 
    else if (action === 'UPDATE') {
      inventory = inventory.map((p: any) => p.id === id ? { ...p, ...updatedProduct } : p);
    }

    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}