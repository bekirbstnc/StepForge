"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  limit, 
  getDocs, 
  where, 
  doc, 
  updateDoc, 
  increment,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Zap, 
  Gem, 
  Ticket, 
  RefreshCcw, 
  MoreVertical,
  ChevronRight,
  User as UserIcon,
  X
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  profile: {
    displayName: string;
    avatar: string | null;
  };
  currencies: {
    pulse: number;
    gem: number;
    ticket: number;
  };
  stats: {
    totalSteps: number;
  };
  createdAt: string;
  level: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [rewardModal, setRewardModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const userList: UserProfile[] = [];
      snap.forEach(doc => userList.push({ id: doc.id, ...doc.data() } as UserProfile));
      setUsers(userList);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleManualReward = async (type: 'pulse' | 'gem' | 'ticket', amount: number) => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        [`currencies.${type}`]: increment(amount)
      });
      alert(`Successfully gave ${amount} ${type} to ${selectedUser.profile.displayName}`);
      setRewardModal(false);
    } catch (err) {
      alert("Failed to give reward");
    }
  };

  const filteredUsers = users.filter(u => 
    u.profile.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
        <p className="mt-2 text-slate-400">View player profiles, grant manual rewards, and manage account status.</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
        <Search className="h-5 w-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus:ring-0 sm:text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
        <table className="min-w-full divide-y divide-slate-800">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">User / Level</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Currencies</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Total Steps</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-800/50 group-hover:ring-indigo-500/50 transition-all">
                      {user.profile.avatar ? (
                        <img src={user.profile.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
                          <UserIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-white">{user.profile.displayName || "Explorer"}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    <span className="ml-3 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 ring-1 ring-indigo-500/20">
                      LV {user.level || 1}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
                      <Zap className="h-3 w-3" /> {user.currencies.pulse.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-500">
                      <Gem className="h-3 w-3" /> {user.currencies.gem}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                      <Ticket className="h-3 w-3" /> {user.currencies.ticket}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-white">
                  {user.stats.totalSteps.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => { setSelectedUser(user); setRewardModal(true); }}
                    className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                  >
                    Reward
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rewardModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Send Reward</h2>
                <p className="text-sm text-slate-500">To: {selectedUser.profile.displayName}</p>
              </div>
              <button onClick={() => setRewardModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleManualReward('pulse', 5000)}
                className="flex w-full items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:bg-amber-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-amber-500" />
                  <span className="font-bold text-white">+5,000 Pulse</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-amber-500 transition-colors" />
              </button>
              
              <button 
                onClick={() => handleManualReward('gem', 50)}
                className="flex w-full items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 transition-all hover:bg-blue-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <Gem className="h-6 w-6 text-blue-500" />
                  <span className="font-bold text-white">+50 Gems</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-blue-500 transition-colors" />
              </button>
              
              <button 
                onClick={() => handleManualReward('ticket', 5)}
                className="flex w-full items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 transition-all hover:bg-rose-500/10 group"
              >
                <div className="flex items-center gap-3">
                  <Ticket className="h-6 w-6 text-rose-500" />
                  <span className="font-bold text-white">+5 Tickets</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-800">
               <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">Manual admin actions are logged</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
