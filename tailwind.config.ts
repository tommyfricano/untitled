import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        "dark-purple": "#081A1",
        "light-white": "#fffff"
      }
    },
  },
  plugins: [],
} satisfies Config;
