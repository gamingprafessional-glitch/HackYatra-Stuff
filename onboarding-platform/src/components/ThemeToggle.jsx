import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle(
      "dark-mode",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <button
      className="theme-toggle"
      onClick={() =>
        setDarkMode((current) => !current)
      }
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      {darkMode ? "☀️" : "🌙"}

      <span>
        {darkMode
          ? "Light"
          : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;