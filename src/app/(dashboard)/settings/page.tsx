import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return null;

  return (
    <main className="max-w-4xl mx-auto pt-12 pb-24 px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Settings</h1>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Profile Information</h2>
        <SettingsForm user={{
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl
        }} />
      </div>

      <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 shadow-sm text-center md:text-left">
        <h2 className="text-xl font-bold text-red-900 mb-2 tracking-tight">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-6">Permanently delete your account and all associated pages.</p>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-8 py-2.5 rounded-xl transition-all h-auto w-full md:w-auto">
          Delete Account
        </Button>
      </div>
    </main>
  );
}
