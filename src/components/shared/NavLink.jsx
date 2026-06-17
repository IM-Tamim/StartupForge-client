'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children, matchPaths = [] }) => {
    const pathname = usePathname();
    const allMatches = [href, ...matchPaths];
    const isActive = allMatches.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    return (
        <Link
            href={href}
            className={`text-sm transition-colors ${
                isActive
                    ? "font-semibold text-secondary"
                    : "font-medium text-base-content/70 hover:text-secondary"
            }`}
        >
            {children}
        </Link>
    );
};

export default NavLink;