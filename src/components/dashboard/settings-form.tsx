"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "./avatar-upload";

interface SettingsFormProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    email: string;
    avatarUrl: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    formData.append("avatarUrl", avatarUrl);
    
    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <AvatarUpload 
        initialAvatarUrl={user.avatarUrl} 
        username={user.username}
        onAvatarChange={setAvatarUrl}
      />

      <div className="space-y-6">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {message.text}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</Label>
          <Input 
            name="name" 
            defaultValue={user.name || ""} 
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
              defaultValue={user.username || ""} 
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
            value={user.email || ""} 
            className="h-12 bg-slate-100 border-slate-200 rounded-xl max-w-md opacity-60"
          />
          <p className="text-xs text-muted-foreground italic">Email cannot be changed at this time.</p>
        </div>
      </div>

      <hr className="border-slate-100 my-8" />

      <Button 
        type="submit" 
        disabled={isPending}
        className="primary-gradient text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 border-none h-auto"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
