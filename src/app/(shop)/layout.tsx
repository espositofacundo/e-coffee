export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-16">
      {children}
    </main>
  );
}
