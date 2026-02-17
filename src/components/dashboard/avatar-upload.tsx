"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  initialAvatarUrl?: string | null;
  username?: string | null;
  onAvatarChange: (url: string) => void;
}

export function AvatarUpload({ initialAvatarUrl, username, onAvatarChange }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadFile(formData);
      if ("error" in result) {
        alert(result.error);
      } else if (result.url) {
        setAvatarUrl(result.url);
        onAvatarChange(result.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-4 border-white shadow-md">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-xl font-bold bg-slate-100 text-slate-400">
            {username?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profile Picture</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-lg h-9 font-bold"
          >
            Upload New
          </Button>
          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setAvatarUrl("");
                onAvatarChange("");
              }}
              disabled={isUploading}
              className="text-slate-500 hover:text-red-500 rounded-lg h-9 font-bold"
            >
              Remove
            </Button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-medium">Recommended: Square JPG, PNG or WEBP. Max 2MB.</p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
