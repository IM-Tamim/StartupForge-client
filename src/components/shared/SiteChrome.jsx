"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const SiteChrome = ({ children }) => {
    const pathname    = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    if (isDashboard) {
        // Dashboard has its own sidebar with logo, nav, and logout —
        // the public navbar/footer would be redundant here.
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