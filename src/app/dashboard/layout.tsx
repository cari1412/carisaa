import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavbar />
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50">
        {children}
      </main>
    </>
  );
}