import { Poppins, Roboto_Slab } from "next/font/google";

export const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const titleFont = Roboto_Slab({
  subsets: ["latin"],
  weight: ["600", "700"],
});
