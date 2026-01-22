"use client";
import React, { use, useState } from 'react'; 
import Link from 'next/link';
import inventoryData from '@/app/data/inventory.json';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;      
  images?: string[];  
  url: string;
  category: string;
  description: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = (inventoryData as Product[]).find((p) => p.id === productId);

  // --- SUGGESTED PRODUCTS LOGIC ---
  const suggestions = (inventoryData as Product[])
    .filter((p) => p.category === product?.category && p.id !== productId)
    .slice(0, 4);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-20">
        <h2 className="text-2xl font-bold mb-4">Product not found.</h2>
        <Link href="/" className="text-blue-500 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const displayImage = activeImage || product.image || (product.images?.[0]) || null;

  const whatsappNumber = "27749907748"; 
  const message = encodeURIComponent(`Hi Jack! I'm interested in the ${product.name} (R${product.price.toLocaleString()}). Is it still available?`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  const emailSubject = encodeURIComponent(`Inquiry: ${product.name}`);
  const emailBody = encodeURIComponent(`Hi Jack,\n\nI saw the ${product.name} for R${product.price.toLocaleString()} on your site and I'm interested. Is it still available?`);
  const emailUrl = `mailto:s230024734@mandela.ac.za?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-20">
      <div className="max-w-6xl mx-auto">
        
        {/* --- BRAND HEADER SECTION --- */}
        <div className="flex flex-col mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
            Hardware Jack<span className="text-blue-500">.</span>
          </h1>
          <Link href="/" className="text-blue-500 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm uppercase tracking-widest">
            <span>←</span> Back to Shop
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mt-8 mb-24">
          
          {/* --- LEFT SIDE: IMAGE & GALLERY --- */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 aspect-square flex items-center justify-center group">
              {displayImage ? (
                <img 
                  src={displayImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="text-zinc-700 font-bold uppercase tracking-widest text-sm">Image Coming Soon</div>
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${!img && 'hidden'} ${displayImage === img ? 'border-blue-500 scale-95' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: PRODUCT INFO --- */}
          <div className="flex flex-col">
            <div className="mb-2">
               <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-bold tracking-widest uppercase text-[10px] border border-blue-500/20">
                 {product.category || 'Premium Device'}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter leading-tight">
              {product.name}
            </h1>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 inline-block">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mb-1">Jack Price</p>
              <div className="text-5xl font-light text-white italic">
                R{product.price.toLocaleString()}
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-light">
                {product.description || "Stress-tested and student-approved hardware."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={whatsappUrl} target="_blank" className="flex items-center justify-center bg-[#25D366] text-white font-bold py-5 rounded-2xl text-lg hover:brightness-110 transition-all">
                WhatsApp to Buy
              </a>
              <a href={emailUrl} className="flex items-center justify-center bg-white text-black font-bold py-5 rounded-2xl text-lg hover:bg-zinc-200 transition-all">
                Email Inquiry
              </a>
            </div>
          </div>
        </div>

        {/* --- SUGGESTED PRODUCTS SECTION --- */}
        {suggestions.length > 0 && (
          <div className="pt-20 border-t border-white/10">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Based on your search</p>
                <h2 className="text-3xl font-bold tracking-tight">Similar {product.category}</h2>
              </div>
              <Link href="/" className="text-zinc-500 hover:text-white transition text-sm font-bold">View Collection →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.map((item) => (
                <Link 
                  href={`/product/${item.id}`} 
                  key={item.id}
                  className="group bg-zinc-900/40 border border-white/5 rounded-[2rem] p-5 hover:border-blue-500/30 transition-all"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black">
                    <img 
                      src={item.image || (item.images && item.images[0])} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={item.name} 
                    />
                  </div>
                  <h4 className="font-bold text-sm mb-1 line-clamp-1">{item.name}</h4>
                  <p className="text-blue-400 text-sm font-medium italic">R{item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}