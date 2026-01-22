"use client";
import React, { useState } from 'react';
import initialReviews from '@/app/data/reviews.json';
import initialInventory from '@/app/data/inventory.json';

// Blueprints
interface Review {
  id: string;
  name: string;
  course: string;
  comment: string;
  date: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  url: string;
  description?: string;
}

export default function JackAdmin() {
  // State for Importer
  const [yagaUrl, setYagaUrl] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [loading, setLoading] = useState(false);

  // State for Lists
  const [reviews, setReviews] = useState<Review[]>(initialReviews as Review[]);
  const [products, setProducts] = useState<Product[]>(initialInventory as Product[]);
  
  // State for Bulk Editing
  const [isBulkMode, setIsBulkMode] = useState(false);

  // --- FEATURE 1: IMPORT FROM YAGA (FIXED PRICE LOGIC) ---
  const handleImport = async () => {
    if (!yagaUrl) return alert("Please paste a link first!");
    setLoading(true);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: JSON.stringify({ url: yagaUrl, selectedCategory: category }),
      });
      const data = await res.json();
      
      if(data.success) {
        // FIXED: Improved price detection logic to prevent "String + Number" errors
        if (data.product.price === 0 || !data.product.price || data.product.price > 100000) {
          const manualPrice = prompt("Price detection failed. What is the Yaga price (e.g. 5000)?");
          if (manualPrice) {
            // FORCE NUMBER: strip characters and ensure it's an integer
            const base = parseInt(manualPrice.replace(/[^0-9]/g, ''));
            const markup = category === 'Laptops' ? 500 : category === 'Phones' ? 400 : 250;
            
            // Numerical addition
            const finalPrice = base + markup;
            
            await fetch('/api/inventory/manage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                action: 'UPDATE', 
                id: data.product.id, 
                updatedProduct: { price: finalPrice } 
              }),
            });
          }
        }
        alert(`Successfully synced ${data.product.name} to the shop!`);
        window.location.reload(); 
      } else {
        alert("Import failed. Check the link or try a different product.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
    setLoading(false);
  };

  // --- FEATURE 2: DELETE REVIEWS (KEEPING EXACT LOGIC) ---
  const deleteReview = async (id: string) => {
    if(!confirm("Delete this review?")) return;
    const res = await fetch('/api/reviews/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setReviews(prev => prev.filter(r => r.id !== id));
  };

  // --- FEATURE 3: MANAGE PRODUCTS (BULK & SINGLE) ---
  const manageProduct = async (action: 'DELETE' | 'UPDATE', id: string, updatedData?: any) => {
    if (action === 'DELETE' && !confirm("Mark as Sold?")) return;
    
    const res = await fetch('/api/inventory/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id, updatedProduct: updatedData }),
    });

    if (res.ok) {
      if (action === 'DELETE') {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
        if (!isBulkMode) alert("Updated successfully!");
      }
    }
  };

  // For Bulk Mode: Updates local state immediately
  const handleLocalUpdate = (id: string, field: string, value: any) => {
    // Ensure price stays a number when typing in bulk mode to avoid JSON errors
    const processedValue = field === 'price' ? (parseInt(value) || 0) : value;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: processedValue } : p));
  };

  // For Bulk Mode: Saves everything
  const saveAllChanges = async () => {
    setLoading(true);
    // Loop through and update each changed product
    for (const p of products) {
      await fetch('/api/inventory/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE', id: p.id, updatedProduct: p }),
      });
    }
    setLoading(false);
    setIsBulkMode(false);
    alert("All changes saved to inventory.json!");
  };

  const openEditDialog = (product: Product) => {
    const newName = prompt("New Name:", product.name);
    const newPrice = prompt("New Price (R):", product.price.toString());
    const newDesc = prompt("New Description:", product.description || "Stress-tested by Jack. 7-day warranty.");
    
    if (newName !== null && newPrice !== null) {
      manageProduct('UPDATE', product.id, { 
        name: newName, 
        price: parseInt(newPrice.replace(/[^0-9]/g, '')), 
        description: newDesc 
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* SECTION 1: AUTO-IMPORTER */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem]">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Auto-Importer</h1>
          <div className="flex gap-4 mb-6">
            {['Laptops', 'Phones', 'Audio'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)} 
                className={`flex-1 py-3 rounded-xl font-bold border transition ${category === cat ? 'bg-blue-600 border-blue-400 text-white' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Paste Yaga Link..." 
            value={yagaUrl} 
            onChange={(e) => setYagaUrl(e.target.value)}
            className="w-full bg-black border border-zinc-700 p-4 rounded-2xl mb-6 outline-none focus:border-blue-500 transition text-white"
          />
          <button 
            onClick={handleImport} 
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 disabled:bg-zinc-800 transition"
          >
            {loading ? "Syncing..." : `Sync to ${category}`}
          </button>
        </div>

        {/* SECTION 2: PRODUCT MANAGER (BULK ENABLED) */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white/90">Inventory Manager</h2>
            <button 
              onClick={() => setIsBulkMode(!isBulkMode)}
              className={`px-6 py-2 rounded-full font-bold text-xs transition ${isBulkMode ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
            >
              {isBulkMode ? "EXIT BULK EDIT" : "ENTER BULK EDIT"}
            </button>
          </div>

          {!isBulkMode ? (
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="bg-black/40 p-4 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-white/10 transition">
                  <div className="flex items-center gap-4">
                    {p.image ? (
                      <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">No Pic</div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-white">{p.name}</p>
                      <p className="text-blue-500 text-xs font-mono">R{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditDialog(p)} className="bg-zinc-800 px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-zinc-700 transition">EDIT</button>
                    <button onClick={() => manageProduct('DELETE', p.id)} className="bg-red-500/10 text-red-500 px-3 py-2 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition">SOLD</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] uppercase text-zinc-500 tracking-widest">
                    <th className="px-4">Product & Gallery</th>
                    <th className="px-4">Price (R)</th>
                    <th className="px-4">Description</th>
                    <th className="px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="bg-black/40 border border-white/5">
                      <td className="p-4 rounded-l-2xl">
                        <div className="flex flex-col gap-2">
                          <input 
                            value={p.name} 
                            onChange={(e) => handleLocalUpdate(p.id, 'name', e.target.value)}
                            className="bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none text-sm font-bold w-full"
                          />
                          <div className="flex gap-1 overflow-x-auto pb-2">
                            {/* GALLERY DISPLAY: Shows all images from Yaga */}
                            {p.images?.map((img, idx) => (
                              <div key={idx} className="relative group/img flex-shrink-0">
                                <img src={img} className="w-8 h-8 rounded border border-white/10" alt="Gallery item" />
                                <button 
                                  onClick={() => handleLocalUpdate(p.id, 'images', p.images.filter((_, i) => i !== idx))}
                                  className="absolute -top-1 -right-1 bg-red-500 text-[8px] rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover/img:opacity-100"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <input 
                          type="number"
                          value={p.price}
                          onChange={(e) => handleLocalUpdate(p.id, 'price', e.target.value)}
                          className="bg-zinc-800 px-3 py-1 rounded-lg w-24 text-blue-400 font-mono text-sm"
                        />
                      </td>
                      <td className="p-4">
                        <textarea 
                          value={p.description}
                          onChange={(e) => handleLocalUpdate(p.id, 'description', e.target.value)}
                          className="bg-zinc-800 p-2 rounded-lg text-xs w-full h-12 outline-none resize-none"
                        />
                      </td>
                      <td className="p-4 rounded-r-2xl text-right">
                        <button onClick={() => manageProduct('DELETE', p.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                onClick={saveAllChanges} 
                disabled={loading}
                className="mt-6 w-full bg-green-600 py-4 rounded-2xl font-bold hover:bg-green-500 transition"
              >
                {loading ? "SAVING..." : "SAVE ALL CHANGES TO DATABASE"}
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3: REVIEWS (MODERATION) */}
        <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem]">
          <h2 className="text-2xl font-bold mb-6 text-white/90">Moderation</h2>
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-black/40 p-6 rounded-2xl flex justify-between items-center border border-white/5">
                <div>
                  <p className="font-bold text-sm text-white">{rev.name} <span className="text-blue-500 ml-2">— {rev.course}</span></p>
                  <p className="text-zinc-400 text-xs mt-1 italic">"{rev.comment}"</p>
                </div>
                <button onClick={() => deleteReview(rev.id)} className="text-red-500 text-xs font-bold px-4 py-2 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition">DELETE</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}