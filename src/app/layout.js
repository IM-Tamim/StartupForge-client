import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SiteChrome from "@/components/shared/SiteChrome";

export const metadata = {
  title: "StartupForge",
  description:
    "StartupForge is where startup founders publish ideas, build teams, and recruit collaborators. Browse startups, find opportunities, and grow together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="abyss">
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}