"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ShoppingBag, 
  Zap, 
  Sparkles, 
  Gift,
  X,
  Image as ImageIcon,
  DollarSign
} from "lucide-react";

interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'pulse' | 'gem' | 'ticket';
  category: 'reward' | 'boost' | 'utility' | 'cosmetic' | 'skin';
  multiplier?: number;
  duration?: number;
  icon: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function MarketPage() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    const q = collection(db, "market_items");
    const unsub = onSnapshot(q, (snap) => {
      const itemList: MarketItem[] = [];
      snap.forEach(doc => itemList.push({ id: doc.id, ...doc.data() } as MarketItem));
      setItems(itemList);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => item.category === activeCategory || (activeCategory === 'market' && ['boost', 'reward', 'utility', 'cosmetic'].includes(item.category)));

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item from the store?")) {
      await deleteDoc(doc(db, "market_items", id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Market Management</h1>
          <p className="mt-2 text-slate-400">Manage items in the Reward, Boost, and Cosmetic stores.</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Add Store Item
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'reward', 'boost', 'utility', 'cosmetic', 'skin'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-800/50 hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-3 ring-1 ring-white/10 ${
                item.category === 'reward' ? 'bg-amber-500/10 text-amber-500' :
                item.category === 'boost' ? 'bg-indigo-500/10 text-indigo-500' :
                'bg-pink-500/10 text-pink-500'
              }`}>
                {item.category === 'reward' ? <Gift className="h-6 w-6" /> : 
                 item.category === 'boost' ? <Zap className="h-6 w-6" /> : 
                 <Sparkles className="h-6 w-6" />}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-indigo-400">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xl font-black ${
                  item.currency === 'pulse' ? 'text-amber-500' :
                  item.currency === 'gem' ? 'text-blue-500' :
                  'text-rose-500'
                }`}>
                  {item.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {item.currency}
                </span>
              </div>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-slate-700">
                {item.category}
              </span>
            </div>
            
            {item.multiplier && (
              <div className="mt-4 rounded-lg bg-indigo-500/5 p-2 text-center text-xs font-medium text-indigo-400 ring-1 ring-indigo-500/10">
                Effect: {item.multiplier}x for {item.duration}m
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <MarketItemFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function MarketItemFormModal({ item, onClose }: { item: MarketItem | null, onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<MarketItem>>(
    item || {
      title: "",
      description: "",
      price: 1000,
      currency: "pulse",
      category: "boost",
      icon: "Zap",
      rarity: "common"
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = item?.id || `item_${Date.now()}`;
    await setDoc(doc(db, "market_items", id), formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item ? 'Edit Item' : 'New Market Item'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Item Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
              <select
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="reward">Reward</option>
                <option value="boost">Boost</option>
                <option value="utility">Utility</option>
                <option value="cosmetic">Cosmetic</option>
                <option value="skin">Skin</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rarity</label>
              <select
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.rarity}
                onChange={(e) => setFormData({ ...formData, rarity: e.target.value as any })}
              >
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Currency</label>
              <select
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
              >
                <option value="pulse">Pulse</option>
                <option value="gem">Gem</option>
                <option value="ticket">Ticket</option>
              </select>
            </div>
          </div>
          {formData.category === 'boost' && (
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-indigo-500/5 p-4 ring-1 ring-indigo-500/10">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Multiplier (e.g. 2.0)</label>
                <input
                  type="number"
                  step="0.1"
                  className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                  value={formData.multiplier || ""}
                  onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Duration (min)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white sm:text-sm"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
