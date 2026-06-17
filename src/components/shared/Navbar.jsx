"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./NavLink";
import ThemeController from "./ThemeController";
import toast from "react-hot-toast";
import logo from "@/assets/logo.png";
import { FiMenu, FiZap, FiGrid, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut();
        toast.success("Logged out successfully!");
    };

    const links = (
        <>
            <li><NavLink href="/">Home</NavLink></li>
            <li><NavLink href="/startups">Browse Startups</NavLink></li>
            <li><NavLink href="/opportunities">Opportunities</NavLink></li>
        </>
    );

    return (
        <div className="sticky top-0 z-50 backdrop-blur-md bg-base-100/90 border-b border-base-300">
            <div className="navbar container mx-auto px-4">

                {/* ── Start: mobile menu + logo ── */}
                <div className="navbar-start gap-1">
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-2 text-base-content/70">
                            <FiMenu size={20} />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content z-50 mt-3 w-52 p-2 rounded-xl shadow-xl bg-base-100 border border-base-300 gap-1"
                        >
                            {links}
                        </ul>
                    </div>

                    <Link href="/" className="flex items-center gap-2">
                        <Image src={logo} alt="Logo" width={40} height={40} />
                        <span className="text-xl font-black tracking-tight text-base-content">
                            Startup<span className="text-secondary">Forge</span>
                        </span>
                    </Link>
                </div>

                {/* ── Center: nav links (desktop) ── */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="flex items-center gap-7">
                        {links}
                    </ul>
                </div>

                {/* ── End: theme toggle + auth ── */}
                <div className="navbar-end gap-3">
                    <ThemeController />

                    {isPending ? (
                        <span className="loading loading-spinner loading-sm text-secondary" />
                    ) : user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex items-center gap-2 px-1.5 py-1 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                                    {user?.image && user.image.startsWith("http") ? (
                                        <Image
                                            src={user.image}
                                            alt={user?.name || "User"}
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-secondary">
                                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-base-content hidden sm:inline max-w-24 truncate">
                                    {user?.name || "User"}
                                </span>
                                <FiChevronDown size={14} className="text-base-content/40" />
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content z-50 mt-3 w-56 rounded-xl shadow-xl bg-base-100 border border-base-300 overflow-hidden"
                            >
                                <li className="px-4 py-3 border-b border-base-300">
                                    <p className="text-xs text-base-content/50">Signed in as</p>
                                    <p className="text-sm font-bold text-base-content capitalize">
                                        {user?.role || "member"}
                                    </p>
                                </li>
                                <li>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-base-content hover:bg-base-200 transition-colors"
                                    >
                                        <FiGrid size={15} /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-base-content hover:bg-base-200 transition-colors"
                                    >
                                        <FiUser size={15} /> Profile
                                    </Link>
                                </li>
                                <li className="border-t border-base-300">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                                    >
                                        <FiLogOut size={15} /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/signin"
                                className="btn btn-sm rounded-lg text-sm font-semibold border border-base-300 bg-base-100 text-base-content hover:bg-base-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="btn btn-sm btn-secondary rounded-lg text-sm font-bold"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;