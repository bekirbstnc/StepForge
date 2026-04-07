"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TrendingUp, 
  CheckSquare, 
  ShoppingBag, 
  Users, 
  Calendar, 
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Economy", href: "/economy", icon: TrendingUp },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Market", href: "/market", icon: ShoppingBag },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Users", href: "/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-800 px-6">
        <ShieldCheck className="h-8 w-8 text-indigo-500" />
        <span className="ml-3 text-xl font-bold tracking-tight text-white">StepForge Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-100"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => signOut()}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-500 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
