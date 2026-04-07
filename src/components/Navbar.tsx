"use client";

import { useAuth } from "@/lib/auth-context";
import { User, Bell, Search } from "lucide-react";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-slate-800 bg-slate-950/50 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-500" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-slate-100 placeholder:text-slate-500 focus:ring-0 sm:text-sm"
            placeholder="Search players, tasks, items..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-100">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-800" aria-hidden="true" />

          {/* User profile */}
          <div className="flex items-center gap-x-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">{user?.displayName || "Admin"}</span>
              <span className="text-xs text-slate-500">Super Administrator</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 p-2 ring-2 ring-indigo-500/20">
              {user?.photoURL ? (
                <img className="h-full w-full rounded-full" src={user.photoURL} alt="" />
              ) : (
                <User className="h-6 w-6 text-slate-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
