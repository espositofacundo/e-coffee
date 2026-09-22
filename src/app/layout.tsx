import type { Metadata } from "next";
import "./globals.css";
import { bodyFont } from "@/config/fonts";
import { store } from "@/config/store";
import Footer from "@/components/ui/footer/Footer";
import Provider from "@/components/provider/Provider";
import TopMenu from "@/components/ui/top-menu/topMenu";
import Sidebar from "@/components/ui/sidebar/Sidebar";

export const metadata: Metadata = {
  title: {
    template: `%s - ${store.name}`,
    default: `${store.name} | Frutos secos y alimentos naturales`,
  },
  description: store.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bodyFont.className} min-h-screen flex flex-col`}>
        <Provider>
          <TopMenu />
          <Sidebar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
