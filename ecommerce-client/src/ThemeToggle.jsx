// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <label
      className="swap swap-rotate btn btn-ghost btn-circle"
      title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
    >
      {/* hidden checkbox */}
      <input
        type="checkbox"
        className="theme-controller"
        value="dark"
        checked={theme === "dark"}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />

      {/* Sun icon – shown in light mode (when not checked) */}
      <svg
        className="swap-off h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64 17l-.71.71a1 1 0 000 1.41 1 1 0 001.41 0l.71-.71A1 1 0 005.64 17zM5 12a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm7-7a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zM5.64 7.05a1 1 0 00.7.29 1 1 0 00.71-.29 1 1 0 000-1.41l-.71-.71A1 1 0 004.93 6.34zm12 .29a1 1 0 00.7-.29l.71-.71a1 1 0 00-1.41-1.41L17 5.64a1 1 0 000 1.41 1 1 0 00.7.29zM21 11h-1a1 1 0 000 2h1a1 1 0 000-2zm-9 8a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM18.36 17A1 1 0 0017 18.36l.71.71a1 1 0 001.41 0 1 1 0 000-1.41zM12 6.5a5.5 5.5 0 105.5 5.5A5.51 5.51 0 0012 6.5z" />
      </svg>

      {/* Moon icon – shown in dark mode (when checked) */}
      <svg
        className="swap-on h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73 8.15 8.15 0 01-9.08-9.08 8.59 8.59 0 01.25-2 1 1 0 00-1.36-1.36 10.14 10.14 0 1011.69 11.69 1 1 0 00-.14-1.05z" />
      </svg>
    </label>
  );
};

export default ThemeToggle;