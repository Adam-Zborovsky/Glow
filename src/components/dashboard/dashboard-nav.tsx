"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

interface DashboardNavProps {
  user?: any;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Pages", href: "/dashboard" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">
              g
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">glow</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all relative py-5",
                  isActive 
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              className="bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-48 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none h-9" 
              placeholder="Search pages..." 
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="text-slate-500 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition-colors outline-none">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 mt-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-900">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">You don't have any new notifications right now.</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="outline-none">
                <Avatar className="w-8 h-8 border border-slate-200 hover:opacity-80 transition-opacity">
                  <AvatarImage src={user?.image || `https://i.pravatar.cc/150?u=${user?.email}`} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
