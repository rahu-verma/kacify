import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#d1c0a6",
        "primary-medium": "#B8A78D",
        "primary-dark": "#534A42",
      },
    },
  },
  plugins: [],
};

export default config;
