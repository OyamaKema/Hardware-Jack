"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import inventoryData from '@/app/data/inventory.json';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hardware-jack-wishlist');
    if (saved) {
      const ids = JSON.parse(saved);
      setWishlistIds(ids);
      
      // Filter inventory to find the items that match the saved IDs
      const items = (inventoryData as Product[]).filter(item => ids.includes(item.id));
      setWishlistItems(items);
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    const updatedIds = wishlistIds.filter(wishId => wishId !== id);
    setWishlistIds(updatedIds);
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    localStorage.setItem('hardware-jack-wishlist', JSON.stringify(updatedIds));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="fixed top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-16">
          <Link href="/shop" className="text-blue-500 text-sm font-black uppercase tracking-widest mb-4 block hover:text-white transition">
            ← Back to Shop
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">
                Your Vault<span className="text-blue-600">.</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">
                Items you've saved for the next semester
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-xl">
                <span className="text-3xl font-black italic">{wishlistItems.length}</span>
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest ml-3">Items Saved</span>
            </div>
          </div>
        </header>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:border-blue-500/30 transition-all"
              >
                {/* Product Image */}
                <Link href={`/product/${item.id}`} className="w-full md:w-48 aspect-square bg-black/40 rounded-3xl flex items-center justify-center p-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Info */}
                <div className="flex-grow text-center md:text-left">
                  <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{item.category}</p>
                  <h3 className="text-2xl md:text-4xl font-black tracking-tighter italic mb-2">{item.name}</h3>
                  <p className="text-3xl font-bold text-white tracking-tighter">R {item.price.toLocaleString()}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <a 
                    href={`https://wa.me/27749907748?text=Hey Jack, I'm interested in the ${item.name} from my wishlist.`}
                    target="_blank"
                    className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-center hover:scale-105 transition-all"
                  >
                    Ask Jack
                  </a>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-white/5 border border-white/10 text-gray-400 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
            <span className="text-6xl block mb-6">📦</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-gray-400">Your vault is empty</h2>
            <Link href="/shop" className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all inline-block">
              Go Fill It Up
            </Link>
          </div>
        )}

        {/* Footer Note */}
        <footer className="mt-20 text-center">
            <p className="text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase">
                Hardware Jack • Wishlist Sync v1.0
            </p>
        </footer>
      </div>
    </div>
  );
}