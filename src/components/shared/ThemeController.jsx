"use client";
import { useEffect, useState } from "react";

const ThemeController = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const dark = saved === "abyss";
         const setDark = () => {
            setIsDark(dark);
        }
        setDark();
        document.documentElement.setAttribute("data-theme", dark ? "abyss" : "silk");
    }, []);

    const handleToggle = () => {
        const dark = !isDark;
        setIsDark(dark);
        document.documentElement.setAttribute("data-theme", dark ? "abyss" : "silk");
        localStorage.setItem("theme", dark ? "abyss" : "silk");
    };

    return (
        <button
            onClick={handleToggle}
            className="btn btn-ghost btn-circle btn-sm text-base-content"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="m4.93 4.93 1.41 1.41"></path>
                        <path d="m17.66 17.66 1.41 1.41"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="m6.34 17.66-1.41 1.41"></path>
                        <path d="m19.07 4.93-1.41 1.41"></path>
                    </g>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    </g>
                </svg>
            )}
        </button>
    );
};

export default ThemeController;