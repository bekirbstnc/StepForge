"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Zap, 
  Gift, 
  Info,
  RefreshCcw,
  Save,
  AlertCircle
} from "lucide-react";

interface EventConfig {
  activeEvent: {
    id: string;
    title: string;
    multiplier: number;
    description: string;
    isActive: boolean;
    expiresAt: string;
    color: string;
  };
}

export default function EventsPage() {
  const [config, setConfig] = useState<EventConfig>({
    activeEvent: {
      id: "none",
      title: "No Active Event",
      multiplier: 1.0,
      description: "Standard generation rates apply.",
      isActive: false,
      expiresAt: new Date().toISOString(),
      color: "#6366f1"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "global_config", "events"), (doc) => {
      if (doc.exists()) {
        setConfig(doc.data() as EventConfig);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "global_config", "events"), config);
      alert("Event updated successfully!");
    } catch (err) {
      alert("Error updating event.");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><RefreshCcw className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Event System</h1>
          <p className="mt-2 text-slate-400">Schedule special events and global Pulse multipliers.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Apply Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Event Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Calendar className="h-5 w-5" />
              <h3 className="font-semibold text-white">Active Event Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Event Title</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={config.activeEvent.title}
                  onChange={(e) => setConfig({ ...config, activeEvent: { ...config.activeEvent, title: e.target.value } })}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={2}
                  value={config.activeEvent.description}
                  onChange={(e) => setConfig({ ...config, activeEvent: { ...config.activeEvent, description: e.target.value } })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Pulse Multiplier</label>
                <div className="mt-1 flex items-center gap-3">
                   <Zap className="h-4 w-4 text-amber-500" />
                   <input
                    type="number"
                    step="0.1"
                    className="block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={config.activeEvent.multiplier}
                    onChange={(e) => setConfig({ ...config, activeEvent: { ...config.activeEvent, multiplier: parseFloat(e.target.value) } })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiry Date</label>
                <div className="mt-1 flex items-center gap-3">
                   <Clock className="h-4 w-4 text-slate-500" />
                   <input
                    type="datetime-local"
                    className="block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={config.activeEvent.expiresAt.slice(0, 16)}
                    onChange={(e) => setConfig({ ...config, activeEvent: { ...config.activeEvent, expiresAt: new Date(e.target.value).toISOString() } })}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-4">
                 <div className="flex items-center justify-between rounded-xl bg-indigo-500/5 p-4 ring-1 ring-indigo-500/10">
                    <div>
                       <p className="text-sm font-bold text-white">Event Visibility</p>
                       <p className="text-xs text-slate-500">When enabled, this event is broadcasted to all users.</p>
                    </div>
                    <button
                      onClick={() => setConfig({ ...config, activeEvent: { ...config.activeEvent, isActive: !config.activeEvent.isActive } })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ring-2 ring-indigo-500/20 ${config.activeEvent.isActive ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.activeEvent.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Preview (Mobile App View)</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
             <div className="h-4 w-full bg-slate-900 flex justify-center py-1">
                <div className="h-3 w-16 rounded-full bg-black/40" />
             </div>
             <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="h-2 w-8 rounded-full bg-slate-800" />
                   <div className="flex gap-1">
                      <div className="h-2 w-4 rounded-full bg-slate-800" />
                      <div className="h-2 w-4 rounded-full bg-slate-800" />
                      <div className="h-2 w-6 rounded-full bg-slate-800" />
                   </div>
                </div>
                
                {config.activeEvent.isActive ? (
                  <div className="animate-pulse-slow rounded-2xl p-4 shadow-lg shadow-indigo-500/10 transition-all border border-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950/20">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-indigo-400" />
                          <span className="text-sm font-bold text-white tracking-tight">{config.activeEvent.title || "Loading Event..."}</span>
                       </div>
                       <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-black text-white uppercase">Active</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{config.activeEvent.description || "The core is buzzing with energy..."}</p>
                    <div className="mt-4 flex items-center gap-3">
                       <div className="flex h-8 items-center gap-2 rounded-full bg-amber-500/10 px-3 ring-1 ring-amber-500/20">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-black text-amber-500">{config.activeEvent.multiplier}x BOOST</span>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-800/50 bg-slate-800/20">
                     <Calendar className="h-8 w-8 text-slate-700 mb-2" />
                     <p className="text-xs font-medium text-slate-500">No scheduled events active</p>
                  </div>
                )}
                
                <div className="space-y-3 pt-2">
                   <div className="h-24 w-full rounded-2xl bg-slate-800/50" />
                   <div className="h-16 w-full rounded-2xl bg-slate-800/50" />
                </div>
             </div>
          </div>
          
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
             <div className="flex gap-3 text-amber-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-medium leading-relaxed italic text-amber-500/80">Updating the active event will push notifications to users if configured in Firebase Cloud Messaging.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
