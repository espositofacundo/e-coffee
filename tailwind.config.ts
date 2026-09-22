import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colores tomados de la lista de precios de Timón & Pumba.
      colors: {
        brand: {
          green: "#11511F",
          "green-dark": "#0B3A15",
          "green-light": "#E4EEE2",
          gold: "#A6741B",
          "gold-dark": "#865D14",
          "gold-light": "#F4E8CF",
          cream: "#FAF6ED",
          "cream-dark": "#F1E7D2",
          ink: "#1F2A1F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
