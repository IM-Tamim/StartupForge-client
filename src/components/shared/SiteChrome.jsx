"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const SiteChrome = ({ children }) => {
    const pathname    = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    if (isDashboard) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

export default SiteChrome;