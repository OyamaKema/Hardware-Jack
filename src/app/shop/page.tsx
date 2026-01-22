"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import inventoryData from '@/app/data/inventory.json';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  url: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(inventoryData as Product[]);
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(40000);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const itemsPerPage = 4;

  // --- WISHLIST LOGIC ---
  useEffect(() => {
    const saved = localStorage.getItem('hardware-jack-wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents clicking the heart from opening the product page
    const updated = wishlist.includes(id) 
      ? wishlist.filter(item => item !== id) 
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('hardware-jack-wishlist', JSON.stringify(updated));
  };

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) setCategory(catFromUrl);
  }, [searchParams]);

  const filteredProducts = [...products]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .filter(p => 
      (category === 'All' || p.category === category) && 
      Number(p.price) <= priceRange
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* GLOWING AURA (Matches Home Page) */}
      <div className="fixed bottom-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto mb-16 flex justify-between items-end relative z-10">
        <div>
          <Link href="/" className="text-blue-500 text-sm font-black uppercase tracking-widest mb-4 block hover:text-white transition">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white italic">THE COLLECTION<span className="text-blue-600">.</span></h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Inventory Status: {filteredProducts.length} items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 relative z-10">
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 italic">Filter Devices</h3>
            <div className="flex flex-col gap-2">
              {['All', 'Laptops', 'Phones', 'Audio'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${category === cat ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'hover:bg-white/5 text-gray-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 italic">Budget: R{priceRange.toLocaleString()}</h3>
            <input 
              type="range" min="1000" max="40000" step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-blue-600 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* QUICK LINK TO WISHLIST */}
          <Link href="/wishlist" className="block p-6 rounded-3xl border border-dashed border-white/10 hover:border-blue-500/50 transition-all group">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Saved Gear</p>
             <p className="text-xl font-black italic group-hover:text-blue-500 transition-colors">Wishlist ({wishlist.length})</p>
          </Link>
        </aside>

        <main className="flex-1">
          {currentItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentItems.map((product: any) => {
                  const displayImage = product.image || (product.images && product.images[0]) || "https://placehold.co/600x400?text=Hardware+Jack";

                  return (
                    <div key={product.id} className="relative group">
                      {/* WISHLIST HEART BUTTON */}
                      <button 
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-xl p-4 rounded-full border border-white/10 hover:scale-110 transition-transform shadow-2xl"
                      >
                        <span className={`text-xl ${wishlist.includes(product.id) ? "text-red-500" : "text-white"}`}>
                          {wishlist.includes(product.id) ? "❤️" : "🤍"}
                        </span>
                      </button>

                      <Link 
                        href={`/product/${product.id}`} 
                        className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full"
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-[2rem] mb-8 bg-black/40 flex items-center justify-center p-6">
                          <img 
                            src={displayImage} 
                            alt={product.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">{product.category}</p>
                          <h4 className="text-3xl font-black mb-6 leading-tight tracking-tighter text-white italic">{product.name}</h4>
                        </div>
                        
                        <div className="w-full flex justify-between items-center pt-8 border-t border-white/5 mt-auto">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Jack Price</p>
                            <span className="text-4xl font-black text-white tracking-tighter italic">R{product.price.toLocaleString()}</span>
                          </div>
                          <div className="bg-white text-black p-5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination UI */}
              <div className="mt-20 flex items-center justify-center gap-8">
                <button 
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="px-8 py-4 rounded-2xl border border-white/10 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition disabled:opacity-10"
                >
                  Prev
                </button>
                <span className="font-black text-gray-500 uppercase text-[10px] tracking-[0.3em]">
                  {currentPage} <span className="text-blue-500">/</span> {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-8 py-4 rounded-2xl border border-white/10 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition disabled:opacity-10"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] backdrop-blur-sm">
              <p className="text-gray-500 font-black uppercase tracking-widest text-xs italic">Nothing in this budget range.</p>
              <button onClick={() => setPriceRange(40000)} className="text-blue-500 font-black mt-6 underline uppercase tracking-widest text-xs">Reset Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-[0.5em] uppercase text-[10px]">Syncing Gear...</div>}>
      <ShopContent />
    </Suspense>
  );
}