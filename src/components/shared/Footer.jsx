import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content border-t border-base-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-center sm:text-left lg:justify-items-center">

                    {/* ── Logo & tagline ── */}
                    <div className="space-y-4 flex flex-col items-center sm:items-start">
                        <div className="flex items-center justify-center gap-2">
                            <Image src={logo} alt="Logo" width={40} height={40} />
                            <h2 className="text-2xl font-black tracking-tight leading-none">
                                <span className="text-base-content">Startup</span>
                                <span className="text-secondary">Forge</span>
                            </h2>
                        </div>
                        <p className="text-sm text-base-content/60 leading-relaxed max-w-sm">
                            Where founders build teams and ideas find their people.
                        </p>
                        <div className="w-40 h-0.5 bg-secondary/30 rounded-full"></div>
                    </div>

                    {/* ── Quick Links ── */}
                    <div className="space-y-4 flex flex-col items-center sm:items-start">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-secondary">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/startups", label: "Browse Startups" },
                                { href: "/opportunities", label: "Opportunities" },
                                { href: "/signup", label: "Get Started" },
                            ].map(({ href, label }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="text-sm text-base-content/60 hover:text-secondary transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* ── Social + Contact ── */}
                    <div className="space-y-5 flex flex-col items-center sm:items-start">
                        <div className="space-y-4 flex flex-col items-center sm:items-start">
                            <h3 className="text-xs font-semibold tracking-widest uppercase text-secondary">
                                Follow Us
                            </h3>
                            <div className="flex gap-4">
                                {[
                                    { href: "https://github.com", icon: FaGithub, label: "GitHub" },
                                    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
                                    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
                                ].map(({ href, icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-full bg-base-300 border border-base-300 flex items-center justify-center text-base-content/60 hover:text-secondary-content hover:bg-secondary hover:border-secondary hover:scale-110 transition-all duration-300"
                                    >
                                        <Icon size={17} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: FiMail, text: "support@startupforge.com" },
                                { icon: FiPhone, text: "+880 1628110902" },
                            ].map(({ icon: Icon, text }) => (
                                <p key={text} className="flex items-center gap-3 text-sm text-base-content/60 justify-center sm:justify-start group">
                                    <span className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                        <Icon className="text-secondary" size={14} />
                                    </span>
                                    <span>{text}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-base-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-base-200 px-4 text-xs text-base-content/30">● ● ●</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-around items-center gap-4 text-center">
                    <p className="text-xs text-base-content/40">
                        © {new Date().getFullYear()} StartupForge. All rights reserved.
                    </p>
                    <div className="flex gap-1 items-center">
                        <span className="text-xs text-base-content/40">Created by</span>
                        <span className="text-xs font-bold bg-linear-to-r from-secondary to-info bg-clip-text text-transparent">IMT</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;