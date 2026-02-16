import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={session?.user} />
      {children}
    </div>
  );
}
