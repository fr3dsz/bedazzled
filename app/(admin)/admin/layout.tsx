"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Menu, X, ExternalLink } from "lucide-react";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Providers>
      <div className="flex min-h-screen bg-[#FDF7FB] dark:bg-[#3D1F35]">
        {/* Mobile Header */}
        <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-[#F0D6E8] bg-white px-4 dark:border-[#8F4D7B]/30 dark:bg-[#6A395B] lg:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8F4D7B] dark:bg-[#DA90C4]">
              <span className="text-sm font-bold text-[#F5EDE0] dark:text-[#6A395B]">B</span>
            </div>
            <span className="text-lg font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Bedazzled Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-[#6A395B] hover:bg-[#FAE8F3] dark:text-[#DA90C4] dark:hover:bg-[#6A395B]/30" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-40 bg-[#6A395B]/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={cn("fixed left-0 top-0 z-50 h-screen w-64 border-r border-[#F0D6E8] bg-white transition-transform dark:border-[#8F4D7B]/30 dark:bg-[#6A395B]", sidebarOpen ? "translate-x-0" : "-translate-x-full", "lg:translate-x-0")}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-[#F0D6E8] px-6 dark:border-[#8F4D7B]/30">
              <Link href="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8F4D7B] dark:bg-[#DA90C4]">
                  <span className="text-sm font-bold text-[#F5EDE0] dark:text-[#6A395B]">B</span>
                </div>
                <span className="text-lg font-semibold text-[#6A395B] dark:text-[#F5EDE0]">Bedazzled Admin</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-[#FAE8F3] text-[#8F4D7B] dark:bg-[#8F4D7B]/30 dark:text-[#F5EDE0]" : "text-[#BE7EAB] hover:bg-[#FAE8F3] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:bg-[#8F4D7B]/20 dark:hover:text-[#F5EDE0]")}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="space-y-3 border-t border-[#F0D6E8] px-3 py-4 dark:border-[#8F4D7B]/30">
              <Link href="/studio" target="_blank" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between gap-2 rounded-lg bg-[#FAE8F3] px-3 py-2 text-sm font-medium text-[#8F4D7B] transition-colors hover:bg-[#F0D6E8] dark:bg-[#8F4D7B]/20 dark:text-[#DA90C4] dark:hover:bg-[#8F4D7B]/30">
                Open Studio
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href="/" onClick={() => setSidebarOpen(false)} className="block px-3 text-sm text-[#BE7EAB] hover:text-[#8F4D7B] dark:text-[#DA90C4] dark:hover:text-[#F5EDE0] transition-colors">
                ← Back to Store
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </Providers>
  );
}

export default AdminLayout;
