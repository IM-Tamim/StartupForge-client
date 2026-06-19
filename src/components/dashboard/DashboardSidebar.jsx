"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import logo from "@/assets/logo.png";
import {
  FiGrid, FiZap, FiPlusCircle, FiList, FiFileText,
  FiUsers, FiDollarSign, FiLogOut, FiChevronRight,
  FiBriefcase, FiUser, FiMenu, FiX, FiHome,
} from "react-icons/fi";

const founderLinks = [
  { href: "/dashboard/founder",                      label: "Overview",             icon: FiGrid,       exact: true },
  { href: "/dashboard/founder/my-startup",           label: "My Startup",           icon: FiZap },
  { href: "/dashboard/founder/add-opportunity",      label: "Add Opportunity",      icon: FiPlusCircle },
  { href: "/dashboard/founder/manage-opportunities", label: "Manage Opportunities", icon: FiList },
  { href: "/dashboard/founder/applications",         label: "Applications",         icon: FiFileText },
];

const collaboratorLinks = [
  { href: "/dashboard/collaborator",                 label: "Overview",             icon: FiGrid,       exact: true },
  { href: "/opportunities",                          label: "Browse Opportunities", icon: FiBriefcase },
  { href: "/dashboard/collaborator/my-applications", label: "My Applications",      icon: FiFileText },
  { href: "/dashboard/collaborator/profile",         label: "Profile",              icon: FiUser },
];

const adminLinks = [
  { href: "/dashboard/admin",                        label: "Overview",             icon: FiGrid,       exact: true },
  { href: "/dashboard/admin/users",                  label: "Manage Users",         icon: FiUsers },
  { href: "/dashboard/admin/startups",               label: "Manage Startups",      icon: FiZap },
  { href: "/dashboard/admin/transactions",           label: "Transactions",         icon: FiDollarSign },
];

const SidebarBody = ({ user, links, onLinkClick, onLogout }) => {
  const pathname = usePathname();
  const isActive = ({ href, exact }) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full mb-10 ">

      {/* Site brand */}
      <Link
        href="/"
        onClick={onLinkClick}
        className="flex items-center gap-2 px-5 py-4 border-b border-base-300 hover:bg-base-200/50 transition-colors"
      >
        <Image src={logo} alt="Logo" width={40} height={40} />
        <span className="font-black text-base-content">
          Startup<span className="text-secondary">Forge</span>
        </span>
      </Link>

      {/* User info */}
      <div className="p-5 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-secondary/15 border border-secondary/30 flex items-center justify-center">
            {user?.image && user.image.startsWith("http") ? (
              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm font-black text-secondary">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-base-content truncate">{user?.name}</p>
            <p className="text-xs text-base-content/50 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive({ href, exact });
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? "bg-secondary/15 text-secondary"
                  : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
              }`}
            >
              <Icon
                size={16}
                className={active ? "text-secondary" : "text-base-content/40 group-hover:text-base-content/70"}
              />
              <span className="flex-1">{label}</span>
              {active && <FiChevronRight size={13} className="text-secondary/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to Home + Logout */}
      <div className="p-3 border-t border-base-300 flex flex-col gap-1">
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/60 hover:bg-base-300 hover:text-base-content transition-colors"
        >
          <FiHome size={16} className="text-base-content/40" />
          Back to Home
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

const DashboardSidebar = ({ user }) => {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links =
    user.role === "founder"        ? founderLinks
    : user.role === "collaborator" ? collaboratorLinks
    : adminLinks;

  const currentLabel = links.find(({ href, exact }) =>
    exact ? pathname === href : pathname.startsWith(href)
  )?.label || "Dashboard";

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-base-100 border-r border-base-300 sticky top-0 h-screen">
        <SidebarBody user={user} links={links} onLogout={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-base-100 border-b border-base-300 shadow-sm">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src={logo} alt="Logo" width={40} height={40} />
          <span className="font-black text-base-content text-sm">
            Startup<span className="text-secondary">Forge</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-base-content/50">{currentLabel}</span>
          <button
            onClick={() => setOpen(true)}
            className="btn btn-ghost btn-sm btn-square rounded-xl"
            aria-label="Open menu"
          >
            <FiMenu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 bg-base-100 border-r border-base-300 flex flex-col shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 btn btn-ghost btn-xs btn-circle z-10"
              aria-label="Close menu"
            >
              <FiX size={16} />
            </button>
            <SidebarBody
              user={user}
              links={links}
              onLinkClick={() => setOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;