"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  name: string;
  study: string;
  text: string;
  rating: number;
  date?: string; // Optional because custom reviews might not have a date set yet
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // 1. Static/Initial Reviews
    const defaultReviews: Review[] = [
      { name: "Thabo M.", study: "Engineering Student", text: "Got a Dell Latitude. Battery lasts through load-shedding. Lifesaver!", rating: 5, date: "Jan 2026" },
      { name: "Sarah J.", study: "Graphic Design", text: "The MacBook Air M1 I got looks brand new. Jack is the real deal.", rating: 5, date: "Dec 2025" },
      { name: "Kabelo D.", study: "BCom Student", text: "Affordable and fast. Much better than buying retail.", rating: 5, date: "Nov 2025" },
      { name: "Cindy P.", study: "Computer Science", text: "Jack upgraded the RAM for me on the spot. Best service in Gqeberha.", rating: 5, date: "Jan 2026" },
      { name: "Luan B.", study: "Architecture", text: "The workstation laptop I bought handles CAD like a dream. Solid price.", rating: 4, date: "Oct 2025" },
      { name: "Musa Z.", study: "Law Student", text: "Simple, fast, and no nonsense. The warranty gave me peace of mind.", rating: 5, date: "Jan 2026" },
    ];

    // 2. Load custom reviews from Local Storage
    const savedReviews = localStorage.getItem('hardware-jack-custom-reviews');
    if (savedReviews) {
      const customReviews = JSON.parse(savedReviews);
      // Put custom reviews at the top so users see their contribution immediately
      setReviews([...customReviews, ...defaultReviews]);
    } else {
      setReviews(defaultReviews);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <header className="mb-20">
          <Link href="/" className="text-blue-500 text-sm font-black uppercase tracking-[0.3em] mb-8 block hover:text-white transition">
            ← Back to HQ
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic uppercase leading-[0.8]">
                Vouch<span className="text-blue-600">ed.</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs mt-8">
                The Student Community speaks for Jack
              </p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-grow">
                    <p className="text-4xl font-black italic">4.9/5</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Average Rating</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-grow">
                    <p className="text-4xl font-black italic">{reviews.length}+</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Verified Sales</p>
                </div>
            </div>
          </div>
        </header>

        {/* MASONRY-STYLE GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((rev, i) => (
            <div 
              key={i} 
              className="break-inside-avoid bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex text-blue-500 text-lg">
                    {"★".repeat(rev.rating)}
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {rev.date || "Just Now"}
                </span>
              </div>
              
              <p className="text-xl md:text-2xl font-medium italic mb-10 leading-relaxed text-gray-200 group-hover:text-white transition-colors">
                "{rev.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center font-black text-xl italic">
                    {rev.name[0]}
                </div>
                <div>
                    <h4 className="font-black text-white uppercase tracking-tight">{rev.name}</h4>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">{rev.study}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-32 mb-20 text-center bg-gradient-to-b from-transparent to-white/5 rounded-[4rem] py-24 border border-white/5">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 text-white">
                Ready to upgrade?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/shop" className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                    Shop Laptops
                </Link>
                <a href="https://wa.me/27749907748" className="bg-transparent border-2 border-white/10 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Talk to Jack
                </a>
            </div>
        </section>

        <footer className="text-center py-10 opacity-30">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Hardware Jack • Verified Reviews</p>
        </footer>
      </div>
    </div>
  );
}