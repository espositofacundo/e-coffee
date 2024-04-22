import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import Footer from "@/components/ui/footer/Footer";



export const metadata: Metadata = {
  title: "E-coffee",
  description: "Una tienda de cafe y delicias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <Footer></Footer></body>
      
    </html>
  );
}
