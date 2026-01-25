"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import inventory from '@/app/data/inventory.json';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Laptops');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', study: '', text: '' });

  const [allReviews, setAllReviews] = useState([
    { name: "Thabo M.", study: "Engineering Student", text: "Got a Dell Latitude. Battery lasts through load-shedding. Lifesaver!", rating: 5 },
    { name: "Sarah J.", study: "Graphic Design", text: "The MacBook Air M1 I got looks brand new. Jack is the real deal.", rating: 5 },
    { name: "Kabelo D.", study: "BCom Student", text: "Affordable and fast. Much better than buying retail.", rating: 5 },
  ]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('hardware-jack-wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedReviews = localStorage.getItem('hardware-jack-custom-reviews');
    if (savedReviews) {
      setAllReviews(prev => [...JSON.parse(savedReviews), ...prev]);
    }
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    let updatedWishlist = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    setWishlist(updatedWishlist);
    localStorage.setItem('hardware-jack-wishlist', JSON.stringify(updatedWishlist));
  };

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.text) return alert("Please fill in your name and review!");
    const reviewToAdd = { ...newReview, rating: 5 };
    const updatedReviews = [reviewToAdd, ...allReviews];
    setAllReviews(updatedReviews);
    const customReviews = JSON.parse(localStorage.getItem('hardware-jack-custom-reviews') || '[]');
    localStorage.setItem('hardware-jack-custom-reviews', JSON.stringify([reviewToAdd, ...customReviews]));
    setNewReview({ name: '', study: '', text: '' });
    setShowReviewForm(false);
  };

  const filteredProducts = inventory.filter((p: any) => p.category === activeCategory);
  const previewProducts = filteredProducts.slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] selection:bg-blue-500/30 relative overflow-x-hidden">
      
      {/* GLOW BACKGROUNDS */}
      <div className="fixed top-[-10%] left-[-10%] w-[100vw] h-[60vh] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[100vw] h-[60vh] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* NAV - Optimized for thumb-reach on mobile */}
      <nav className="bg-black/60 backdrop-blur-2xl sticky top-0 border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            Jacked<span className="text-blue-500">.</span>
          </h1>
          <div className="flex gap-4 md:gap-8 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link href="/shop" className="hover:text-white transition">Shop</Link>
            <Link href="/wishlist" className="hover:text-white transition relative">
              Wishlist {wishlist.length > 0 && <span className="text-blue-500 absolute -top-2 -right-3">({wishlist.length})</span>}
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* HERO SECTION - Tighter for mobile */}
        <header className="max-w-6xl mx-auto text-center pt-20 pb-16 px-6">
          <h2 className="text-[13vw] md:text-[8rem] font-[1000] mb-6 tracking-[ -0.05em] leading-[0.85] uppercase italic italic-action">
            Elite Gear. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Jack Prices.
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 font-bold max-w-2xl mx-auto mb-12 leading-tight uppercase tracking-tight px-4">
            Tested for students. Built for the hustle.
          </p>
          
          {/* FEATURES - Vertical on mobile, Grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16">
            {[
              { icon: "🛡️", label: "7-Day Warranty" },
              { icon: "🚚", label: "GQEBERHA Pickup" },
              { icon: "✅", label: "Hand-Tested" },
              { icon: "💬", label: "Direct Access" },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex md:flex-col items-center gap-4 md:gap-2 hover:bg-white/10 transition backdrop-blur-md">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>

          <Link href="/shop" className="w-full sm:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] inline-block uppercase italic tracking-tighter">
            Browse Inventory
          </Link>
        </header>

        {/* SHOP PREVIEW - Square grids look better on mobile */}
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-5xl md:text-8xl font-[1000] mb-8 text-white tracking-[-0.07em] uppercase italic">The Drop</h2>
            
            {/* Horizontal Scroll for Categories on mobile */}
            <div className="flex overflow-x-auto w-full no-scrollbar justify-start md:justify-center gap-2 p-1">
              {['Laptops', 'Phones', 'Audio'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap flex-1 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-500 border border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {previewProducts.map((product: any) => (
              <div key={product.id} className="relative group">
                <button 
                  onClick={(e) => toggleWishlist(e, product.id)}
                  className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                >
                  <span className={wishlist.includes(product.id) ? "text-red-500" : "text-white"}>
                    {wishlist.includes(product.id) ? "❤️" : "🤍"}
                  </span>
                </button>

                <Link 
                  href={`/product/${product.id}`}
                  className="bg-zinc-900/40 rounded-[2rem] p-6 md:p-8 border border-white/5 flex flex-col aspect-square overflow-hidden backdrop-blur-xl"
                >
                  <div className="h-2/3 w-full flex items-center justify-center mb-4 bg-black/40 rounded-3xl overflow-hidden group-hover:scale-110 transition-transform duration-700">
                    <img 
                      src={product.image || (product.images && product.images[0])} 
                      alt={product.name} 
                      className="max-w-[85%] max-h-[85%] object-contain" 
                    />
                  </div>
                  <div className="text-left mt-auto">
                    <h4 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">{product.name}</h4>
                    <p className="text-xl font-black text-blue-500 mt-2 tracking-tighter italic">R {product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </div>
            ))}

            {/* "VIEW ALL" Card optimized for mobile tap */}
            <Link 
              href={`/shop?category=${activeCategory}`}
              className="bg-blue-600 rounded-[2rem] flex flex-col items-center justify-center aspect-square text-center p-8 group overflow-hidden relative shadow-2xl shadow-blue-600/20"
            >
              <div className="relative z-10">
                <p className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-4 group-hover:scale-110 transition-transform">All Gear</p>
                <span className="text-xs font-black uppercase tracking-[0.4em] bg-black/20 px-4 py-2 rounded-full">Explore Catalog →</span>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </section>

        {/* REVIEWS SECTION - Vertical stacks for better mobile reading */}
        <section className="py-24 bg-gradient-to-b from-transparent to-zinc-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-5xl md:text-8xl font-black mb-12 text-center tracking-tighter uppercase italic">Vouched<span className="text-blue-500">.</span></h3>
            
            <div className="flex flex-col gap-4 mb-12">
              {allReviews.slice(0, 3).map((rev, i) => (
                <div key={i} className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                  <div className="flex text-blue-500 mb-4 text-xs tracking-widest uppercase font-black">Verified Purchase</div>
                  <p className="text-xl md:text-3xl font-bold italic mb-8 leading-tight text-white">"{rev.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic">{rev.name[0]}</div>
                    <div>
                      <p className="font-black text-white uppercase tracking-tighter">{rev.name}</p>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{rev.study}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-8">
               <button 
                 onClick={() => setShowReviewForm(!showReviewForm)}
                 className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:invert transition-all"
               >
                 {showReviewForm ? "Close" : "Vouch for Jack"}
               </button>

               {showReviewForm && (
                  <div className="w-full max-w-xl bg-zinc-900 p-8 rounded-[2.5rem] border border-blue-500/30">
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="NAME" 
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl font-black uppercase tracking-widest focus:border-blue-500 outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="MAJOR / COURSE" 
                        value={newReview.study}
                        onChange={(e) => setNewReview({...newReview, study: e.target.value})}
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl font-black uppercase tracking-widest focus:border-blue-500 outline-none" 
                      />
                      <textarea 
                        placeholder="HOW WAS THE GEAR?" 
                        value={newReview.text}
                        onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl h-32 font-bold focus:border-blue-500 outline-none"
                      ></textarea>
                      <button 
                        onClick={handleSubmitReview}
                        className="w-full bg-blue-600 p-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-blue-500 transition-colors"
                      >
                        Submit Post
                      </button>
                    </div>
                  </div>
               )}
            </div>
          </div>
        </section>

        {/* FOOTER - Bold and Bottom-Heavy */}
        <footer className="bg-black border-t border-white/5 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-6xl md:text-9xl font-[1000] mb-8 tracking-tighter uppercase italic italic-action">Talk to Jack</h2>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/27749907748" className="bg-[#25D366] text-white px-8 py-6 rounded-3xl font-black text-2xl uppercase tracking-tighter italic hover:scale-105 transition-all">
                WhatsApp HQ
              </a>
              <a href="mailto:s230024734@mandela.ac.za" className="bg-white text-black px-8 py-6 rounded-3xl font-black text-2xl uppercase tracking-tighter italic hover:scale-105 transition-all">
                Email Jack
              </a>
            </div>
            <p className="mt-24 text-gray-700 text-[10px] font-black tracking-[0.5em] uppercase px-4 leading-loose">
              © 2026 Hardware Jack • Gqeberhra, South Africa <br /> 
              Authorized Student Hardware Vendor
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .italic-action { transform: skewX(-2deg); }
      `}</style>
    </div>
  );
}