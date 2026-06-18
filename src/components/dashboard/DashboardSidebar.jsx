"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    FiGrid, FiZap, FiPlusCircle, FiList,
    FiFileText, FiLogOut, FiMenu, FiX
} from "react-icons/fi";
import { useState } from "react";

const navItems = [
    { href: "/dashboard/founder",                  label: "Overview",             icon: FiGrid },
    { href: "/dashboard/founder/my-startup",       label: "My Startup",           icon: FiZap },
    { href: "/dashboard/founder/add-opportunity",  label: "Add Opportunity",      icon: FiPlusCircle },
    { href: "/dashboard/founder/manage-opportunities", label: "Manage Opportunities", icon: FiList },
    { href: "/dashboard/founder/applications",     label: "Applications",         icon: FiFileText },
];

const SidebarLink = ({ href, label, icon: Icon, onClick }) => {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                    ? "bg-secondary/15 text-secondary border border-secondary/20"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                }`}
        >
            <Icon size={16} />
            {label}
        </Link>
    );
};

const FounderSidebar = ({ user }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await authClient.signOut();
        toast.success("Logged out!");
        router.push("/");
    };

    const sidebarContent = (onLinkClick) => (
        <div className="flex flex-col h-full">
            {/* User info */}
            <div className="px-4 py-5 border-b border-base-300">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0 font-black text-secondary text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "F"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-base-content truncate">{user?.name}</p>
                        <p className="text-xs text-secondary capitalize">Founder</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                    <SidebarLink key={item.href} {...item} onClick={onLinkClick} />
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-base-300">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all"
                >
                    <FiLogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-base-300 bg-base-100 min-h-[calc(100vh-4rem)] sticky top-16">
                {sidebarContent()}
            </aside>

            {/* Mobile toggle button */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed bottom-5 left-5 z-40 btn btn-secondary btn-circle shadow-lg"
            >
                <FiMenu size={20} />
            </button>

            {/* Mobile drawer */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <aside className="relative w-64 bg-base-100 border-r border-base-300 flex flex-col">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 btn btn-ghost btn-xs btn-circle"
                        >
                            <FiX size={16} />
                        </button>
                        {sidebarContent(() => setOpen(false))}
                    </aside>
                </div>
            )}
        </>
    );
};

export default FounderSidebar;