import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function MainLayout({ children }) {
    return (
        <main className="flex-1 flex flex-col">

            <Navbar />
            {children}
            <Footer />
        </main>
    );
}