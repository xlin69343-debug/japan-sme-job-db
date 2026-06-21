import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#182026",
        muted: "#64717b",
        paper: "#f6f7f5",
        line: "#dde4e2",
        moss: "#1e6b5c",
        rust: "#aa5138",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(25, 37, 44, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

