import Sidebar from "@/components/_common/sidebar/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-dvh max-w-full overflow-hidden">
      <Sidebar />
      {children}
    </main>
  );
}
