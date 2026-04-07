"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Zap, 
  ShoppingBag, 
  CircleCheck, 
  TrendingUp, 
  DollarSign,
  Activity,
  ArrowUpRight,
  UserCheck
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBoosts: 0,
    dailyTasksCompleted: 0,
    totalRewardsClaimed: 0,
    revenuePulse: 0,
    newUsersToday: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // In a real app, you'd use a Cloud Function for these aggregations
      // For now, we'll fetch some basic counts
      try {
        const usersSnap = await getDocs(query(collection(db, "users"), limit(1)));
        // Mocking for now since we don't have thousands of docs to count client-side
        setStats({
          totalUsers: 1248,
          activeBoosts: 85,
          dailyTasksCompleted: 342,
          totalRewardsClaimed: 12,
          revenuePulse: 450000,
          newUsersToday: 24
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="mt-2 text-slate-400">Welcome back, Admin. Here's what's happening in StepForge today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Explorers"
          value={stats.totalUsers}
          description="Total registered users"
          icon={Users}
          trend={{ value: "+12%", positive: true }}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Daily Active Users"
          value={stats.newUsersToday * 15} // Simplified math
          description="Users active in last 24h"
          icon={UserCheck}
          trend={{ value: "+5.4%", positive: true }}
          color="bg-emerald-500"
        />
        <DashboardCard
          title="Pulse Generated"
          value={`${(stats.revenuePulse / 1000).toFixed(1)}K`}
          description="Total Pulse created today"
          icon={Zap}
          trend={{ value: "+22%", positive: true }}
          color="bg-amber-500"
        />
        <DashboardCard
          title="Tasks Completed"
          value={stats.dailyTasksCompleted}
          description="Total tasks finished today"
          icon={CircleCheck}
          trend={{ value: "+8%", positive: true }}
          color="bg-indigo-500"
        />
        <DashboardCard
          title="Rewards Claimed"
          value={stats.totalRewardsClaimed}
          description="Real-world rewards requested"
          icon={ShoppingBag}
          trend={{ value: "Stable", positive: true }}
          color="bg-rose-500"
        />
        <DashboardCard
          title="Market Conversion"
          value="4.2%"
          description="Visit to purchase ratio"
          icon={Activity}
          trend={{ value: "-1.2%", positive: false }}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activities Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Redemptions</h3>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center">
              View all <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/30 p-4 border border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">User_{i * 123} redeemed ₺25 Google Play</p>
                    <p className="text-xs text-slate-500">{i * 10} minutes ago</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Economy Health */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Economy Health</h3>
            <TrendingUp className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Pulse Inflation Rate</span>
                <span className="text-sm font-medium text-emerald-400">Healthy (2.4%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div className="h-full w-[30%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Reward Ticket Supply</span>
                <span className="text-sm font-medium text-amber-400">Nominal</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div className="h-full w-[65%] rounded-full bg-amber-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Gem Burn Rate</span>
                <span className="text-sm font-medium text-indigo-400">High (+15%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800">
                <div className="h-full w-[85%] rounded-full bg-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
