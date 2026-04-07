"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Save, 
  RefreshCcw, 
  Info, 
  AlertCircle,
  Zap,
  Ticket,
  Gem,
  Coins
} from "lucide-react";

interface EconomyConfig {
  pulseBaseRate: number;
  pulseStepMultiplier: number;
  ticketDailyLimit: number;
  gemToPulseRate: number;
  minTicketRedeemAmount: number;
  maintenanceMode: boolean;
}

export default function EconomyPage() {
  const [config, setConfig] = useState<EconomyConfig>({
    pulseBaseRate: 1.0,
    pulseStepMultiplier: 0.1,
    ticketDailyLimit: 5,
    gemToPulseRate: 100,
    minTicketRedeemAmount: 10,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "global_config", "economy"), (doc) => {
      if (doc.exists()) {
        setConfig(doc.data() as EconomyConfig);
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
    setMessage({ text: "", type: "" });
    try {
      await setDoc(doc(db, "global_config", "economy"), config);
      setMessage({ text: "Economy settings updated successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to update settings.", type: "error" });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><RefreshCcw className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Economy Control</h1>
          <p className="mt-2 text-slate-400">Manage global rewarding rates and currency limits.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      {message.text && (
        <div className={`rounded-xl p-4 flex items-center gap-3 border ${
          message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <Info className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pulse Generation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-center gap-3 text-amber-400">
            <Zap className="h-5 w-5" />
            <h3 className="font-semibold text-white">Pulse Generation</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Base Generation Rate</label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="number"
                  step="0.1"
                  className="block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={config.pulseBaseRate}
                  onChange={(e) => setConfig({ ...config, pulseBaseRate: parseFloat(e.target.value) })}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">Pulse / Min</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Step Multiplier</label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="number"
                  step="0.01"
                  className="block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={config.pulseStepMultiplier}
                  onChange={(e) => setConfig({ ...config, pulseStepMultiplier: parseFloat(e.target.value) })}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">Per 1000 steps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Tickets */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-center gap-3 text-rose-400">
            <Ticket className="h-5 w-5" />
            <h3 className="font-semibold text-white">Ticket Systems</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Daily Ticket Limit</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={config.ticketDailyLimit}
                onChange={(e) => setConfig({ ...config, ticketDailyLimit: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Min Redemption Amount</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={config.minTicketRedeemAmount}
                onChange={(e) => setConfig({ ...config, minTicketRedeemAmount: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Currency Conversions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-center gap-3 text-indigo-400">
            <Gem className="h-5 w-5" />
            <h3 className="font-semibold text-white">Currency & Conversions</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Gem to Pulse Conversion</label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="number"
                  className="block w-full rounded-lg border-slate-700 bg-slate-800 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={config.gemToPulseRate}
                  onChange={(e) => setConfig({ ...config, gemToPulseRate: parseInt(e.target.value) })}
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">1 Gem = X Pulse</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-center gap-3 text-slate-400">
            <RefreshCcw className="h-5 w-5" />
            <h3 className="font-semibold text-white">System Status</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Enable to block user app access</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ring-2 ring-indigo-500/20 ${config.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-6">
         <div className="flex gap-4">
            <Info className="h-6 w-6 text-indigo-400 shrink-0" />
            <div>
               <h4 className="text-sm font-semibold text-white">Economic Warning</h4>
               <p className="text-sm text-slate-400 mt-1">Changes to base generation rates will affect all active users immediately. Use with caution to avoid Pulse inflation.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
