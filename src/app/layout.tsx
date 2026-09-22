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
  // En public/ y con nombre propio: los íconos de src/app se sirven siempre con
  // la misma URL y quedan cacheados aunque cambie el archivo.
  icons: {
    icon: [{ url: "/icons/favicon-128.png", type: "image/png", sizes: "128x128" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
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
