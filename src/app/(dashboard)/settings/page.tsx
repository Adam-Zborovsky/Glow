import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    const name = formData.get("name") as string;
    const username = formData.get("username") as string;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, username }
    });

    revalidatePath("/settings");
  }

  return (
    <main className="max-w-4xl mx-auto pt-12 pb-24 px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Settings</h1>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Profile Information</h2>
        
        <form action={updateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</Label>
            <Input 
              name="name" 
              defaultValue={user?.name || ""} 
              placeholder="Your name"
              className="h-12 bg-slate-50 border-slate-200 rounded-xl max-w-md"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</Label>
            <div className="relative max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">glow.page/</span>
              <Input 
                name="username" 
                defaultValue={user?.username || ""} 
                placeholder="yourname"
                className="h-12 bg-slate-50 border-slate-200 rounded-xl pl-[88px]"
              />
            </div>
            <p className="text-xs text-muted-foreground">This is your unique URL on Glow.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</Label>
            <Input 
              disabled 
              value={user?.email || ""} 
              className="h-12 bg-slate-100 border-slate-200 rounded-xl max-w-md opacity-60"
            />
            <p className="text-xs text-muted-foreground italic">Email cannot be changed at this time.</p>
          </div>

          <hr className="border-slate-100 my-8" />

          <Button type="submit" className="primary-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 border-none h-auto">
            Save Changes
          </Button>
        </form>
      </div>

      <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-red-900 mb-2 tracking-tight">Danger Zone</h2>
        <p className="text-sm text-red-600 mb-6">Permanently delete your account and all associated pages.</p>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-8 py-2.5 rounded-xl transition-all h-auto">
          Delete Account
        </Button>
      </div>
    </main>
  );
}
