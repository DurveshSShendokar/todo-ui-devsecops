import { useTheme } from "next-themes";
import React from "react";

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      id="step2"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px", // full round
        cursor: "pointer",
        backgroundColor: isDark ? "#1a1a1a" : "#e5e5e5", // dark:bg-dark-bg vs bg-gray-2
        color: "black",
        height: "2.25rem", // 36px (h-9)
        width: "2.25rem",  // 36px (w-9)
      }}
    >
      {!isDark ? (
        <svg
          viewBox="0 0 23 23"
          width="20"
          height="20"
          fill="none"
          style={{ stroke: "currentColor" }}
        >
          <path
            d="M9.55078 1.5C5.80078 1.5 1.30078 5.25 1.30078 11.25C1.30078 17.25 5.80078 21.75 11.8008 21.75C17.8008 21.75 21.5508 17.25 21.5508 13.5C13.3008 18.75 4.30078 9.75 9.55078 1.5Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          {/* Use your original SVG path here (omitted for brevity) */}
          <path
            d="..." // your full path data
            fill="black"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggler;
