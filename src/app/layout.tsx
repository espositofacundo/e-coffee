import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import Footer from "@/components/ui/footer/Footer";
import Provider from "@/components/provider/Provider";

export const metadata: Metadata = {
  title: {
    template:'%s - E-coffee',
    default:'E-coffee'
  },
  description: "Una tienda de cafe y delicias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
        {children}
        </Provider>
        
        <Footer></Footer>
      </body>
    </html>
  );
}
