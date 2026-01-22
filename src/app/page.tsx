"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import inventory from '@/app/data/inventory.json';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Laptops');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [newReview, setNewReview] = useState({ name: '', study: '', text: '' });

  // Initial reviews state
  const [allReviews, setAllReviews] = useState([
    { name: "Thabo M.", study: "Engineering Student", text: "Got a Dell Latitude. Battery lasts through load-shedding. Lifesaver!", rating: 5 },
    { name: "Sarah J.", study: "Graphic Design", text: "The MacBook Air M1 I got looks brand new. Jack is the real deal.", rating: 5 },
    { name: "Kabelo D.", study: "BCom Student", text: "Affordable and fast. Much better than buying retail.", rating: 5 },
  ]);

  // Load wishlist AND reviews from local storage on mount
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
    let updatedWishlist;
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(id => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('hardware-jack-wishlist', JSON.stringify(updatedWishlist));
  };

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.text) return alert("Please fill in your name and review!");

    const reviewToAdd = { ...newReview, rating: 5 }; // Default to 5 stars for the vibe
    const updatedReviews = [reviewToAdd, ...allReviews];
    
    // Save to State
    setAllReviews(updatedReviews);
    
    // Save only custom reviews to local storage to avoid duplicating defaults
    const customReviews = JSON.parse(localStorage.getItem('hardware-jack-custom-reviews') || '[]');
    localStorage.setItem('hardware-jack-custom-reviews', JSON.stringify([reviewToAdd, ...customReviews]));

    // Reset Form
    setNewReview({ name: '', study: '', text: '' });
    setShowReviewForm(false);
  };

  const filteredProducts = inventory.filter((p: any) => p.category === activeCategory);
  const previewProducts = filteredProducts.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F7] selection:bg-blue-500/30 relative overflow-hidden">
      
      <div className="fixed bottom-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <nav className="bg-black/80 backdrop-blur-2xl sticky top-0 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-white">Hardware Jack<span className="text-blue-500">.</span></h1>
          <div className="flex gap-8 text-[13px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/shop" className="hover:text-white transition">Shop</Link>
            <Link href="/wishlist" className="hover:text-white transition flex items-center gap-1">
              WISHLIST 
              {wishlist.length > 0 && <span className="text-blue-500 text-[10px]">({wishlist.length})</span>}
            </Link>
            <Link href="/reviews" className="hover:text-white transition">REVIEWS</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <header className="max-w-5xl mx-auto text-center py-28 px-6">
          <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
            Elite Gear. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Second-hand price.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium pre-owned tech, stress-tested for students. Why pay retail when you can pay "Jack prices"?
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { icon: "🛡️", label: "7-Day Warranty" },
              { icon: "🚚", label: "Safe Delivery" },
              { icon: "✅", label: "Hand-Tested" },
              { icon: "💬", label: "Direct Support" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition backdrop-blur-md">
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>

          <Link href="/shop" className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-black hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] inline-block uppercase tracking-tighter">
            Start Shopping
          </Link>
        </header>

        {/* Shop Preview Section */}
        <section id="shop" className="py-24 max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tighter uppercase italic">Browse the Collection</h2>
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
              {['Laptops', 'Phones', 'Audio'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewProducts.length > 0 ? (
              <>
                {previewProducts.map((product: any) => (
                  <div key={product.id} className="relative group">
                    <button 
                      onClick={(e) => toggleWishlist(e, product.id)}
                      className="absolute top-6 right-6 z-20 bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10 hover:scale-110 transition-transform"
                    >
                      <span className={wishlist.includes(product.id) ? "text-red-500" : "text-white"}>
                        {wishlist.includes(product.id) ? "❤️" : "🤍"}
                      </span>
                    </button>

                    <Link 
                      href={`/product/${product.id}`}
                      className="bg-zinc-900/60 rounded-[2.5rem] p-8 border border-white/10 hover:border-blue-500/50 transition-all flex flex-col aspect-square overflow-hidden backdrop-blur-xl"
                    >
                      <div className="h-3/5 w-full flex items-center justify-center mb-4 bg-black/20 rounded-3xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={product.image || (product.images && product.images[0])} 
                          alt={product.name} 
                          className="max-w-[90%] max-h-[90%] object-contain" 
                        />
                      </div>
                      <div className="text-left mt-auto">
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight">{product.name}</h4>
                        <p className="text-xl md:text-2xl font-bold text-blue-500 mt-2">R {product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  </div>
                ))}

                <Link 
                  href={`/shop?category=${activeCategory}`}
                  className="group relative bg-blue-600/10 border-2 border-dashed border-blue-500/30 rounded-[2.5rem] flex flex-col items-center justify-center hover:bg-blue-600 transition-all duration-500 aspect-square text-center backdrop-blur-xl"
                >
                  <div className="flex-grow flex items-center justify-center">
                     <div className="w-20 h-20 md:w-28 md:h-28 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-white transition-all shadow-2xl group-hover:scale-110">
                        <svg className="w-12 h-12 text-white group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                     </div>
                  </div>
                  <div className="pb-8 md:pb-12">
                    <span className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase group-hover:scale-110 transition-transform inline-block italic">
                      View All
                    </span>
                  </div>
                </Link>
              </>
            ) : null}
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6">
            <Link href="/reviews">
                <h3 className="text-5xl font-black mb-12 text-center tracking-tighter uppercase italic hover:text-blue-500 transition-colors cursor-pointer">
                    REVIEWS
                </h3>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {allReviews.map((rev, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                  <div className="flex text-yellow-500 mb-4 text-xl">{"★".repeat(rev.rating)}</div>
                  <p className="text-lg italic mb-6 text-gray-200">"{rev.text}"</p>
                  <div>
                    <p className="font-black text-white text-xl tracking-tight">{rev.name}</p>
                    <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">{rev.study}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
               <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
               >
                  {showReviewForm ? "Cancel" : "Add a Review"}
               </button>

               {showReviewForm && (
                  <div className="w-full max-w-xl bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
                    <h4 className="text-2xl font-black mb-6 uppercase italic">Tell your story</h4>
                    <div className="space-y-4 text-white">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                      />
                      <input 
                        type="text" 
                        placeholder="Course of Study" 
                        value={newReview.study}
                        onChange={(e) => setNewReview({...newReview, study: e.target.value})}
                        className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" 
                      />
                      <textarea 
                        placeholder="How was the gear?" 
                        value={newReview.text}
                        onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                        className="w-full bg-black border border-white/10 p-4 rounded-xl h-32 focus:border-blue-500 outline-none"
                      ></textarea>
                      <button 
                        onClick={handleSubmitReview}
                        className="w-full bg-blue-600 p-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
               )}
               
               <Link href="/reviews" className="text-gray-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-all border-b border-transparent hover:border-white">
                  View All Reviews →
               </Link>
            </div>
          </div>
        </section>

        <footer className="bg-white/5 border-t border-white/10 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Got Questions?</h2>
            <p className="text-gray-400 mb-10 text-xl font-medium">Jack is online and ready to help you find the perfect machine.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="https://wa.me/27749907748" className="bg-[#25D366] text-white px-10 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">
                WhatsApp Jack
              </a>
              <a href="mailto:s230024734@mandela.ac.za" className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-gray-200 hover:scale-105 transition-all">
                Email Inquiry
              </a>
            </div>
            <p className="mt-24 text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">© 2026 Hardware Jack • Gqeberhra, South Africa</p>
          </div>
        </footer>
      </div>
    </div>
  );
}