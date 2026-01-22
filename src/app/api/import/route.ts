import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { url, selectedCategory } = await req.json();

    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. IMPROVED NAME LOGIC (Fixes the "Yaga" name bug)
    let name = $('h1').first().text() || $('meta[property="og:title"]').attr('content') || "Premium Device";
    // If the name is just "Yaga", try to get it from the page title
    if (name.trim().toLowerCase() === 'yaga') {
      name = $('title').text().split('|')[0].trim();
    }
    name = name.replace(/Buy/gi, '').replace(/on Yaga/gi, '').trim();

    let description = $('meta[property="og:description"]').attr('content') || "Premium quality hardware.";
    if (description.includes('on Yaga')) description = description.split('on Yaga')[0].trim();

    // 2. DEEP GALLERY SCRAPE (Specifically for Yaga's .jpeg structure)
    let images: string[] = [];

    // METHOD A: Scan every script tag for Yaga image patterns
    $('script').each((_, el) => {
      const content = $(el).html() || '';
      // Regex looks for the unique Yaga image ID patterns ending in .jpeg or .jpg
      const regex = /https:\/\/images\.yaga\.co\.za\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\.(jpeg|jpg)/g;
      const matches = content.match(regex);
      if (matches) {
        images.push(...matches);
      }
    });

    // METHOD B: Fallback to scanning <img> tags
    if (images.length === 0) {
      $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && src.includes('yaga.co.za')) {
          images.push(src);
        }
      });
    }

    // CLEANUP: 
    // 1. Remove thumbnail sizing (?s=600) to get high-res
    // 2. Remove profile/avatar pictures
    // 3. Remove duplicates
    images = images
      .map(img => img.split('?')[0]) 
      .filter(img => !img.includes('profile') && !img.includes('avatar') && img.length > 30);
    
    images = [...new Set(images)];

    // 3. PRICE & MARKUP
    const priceText = $('meta[property="product:price:amount"]').attr('content') || $('[class*="price"]').first().text() || "0";
    const numericPrice = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
    
    let markup = 500;
    if (selectedCategory === 'Phones') markup = 400;
    if (selectedCategory === 'Audio') markup = 250;
    const finalPrice = numericPrice > 0 ? numericPrice + markup : 0;

    // Ensure we have at least one image for the "main" display
    const mainImage = images[0] || $('meta[property="og:image"]').attr('content') || '';

    const newProduct = {
      id: Date.now().toString(),
      name,
      price: finalPrice, 
      image: mainImage, 
      images: images.length > 0 ? images : [mainImage], 
      description,
      url,
      category: selectedCategory 
    };

    // 4. SAVE
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'inventory.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const inventory = JSON.parse(fileData || '[]');
    inventory.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(inventory, null, 2));

    return NextResponse.json({ success: true, product: newProduct });

  } catch (error) {
    console.error("Scrape failed:", error);
    return NextResponse.json({ success: false });
  }
}