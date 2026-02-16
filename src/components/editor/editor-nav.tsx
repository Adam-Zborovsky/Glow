"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Tablet, Monitor, Eye, Save, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore } from "@/stores/editor-store";
import { saveBlocks } from "@/lib/actions";
import { useState } from "react";
import { useParams } from "next/navigation";

export function EditorNav() {
  const { blocks, themeId } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();
  const pageId = params.pageId as string;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveBlocks(pageId, blocks, themeId);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="font-bold text-sm tracking-tight leading-none">Main Bio</h1>
          <div className="flex items-center gap-1.5 mt-1">
            {isSaving ? (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="text-[10px] text-emerald-500 font-medium">All changes saved</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center bg-slate-100 p-1 rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-10 text-slate-400 hover:text-primary">
              <Smartphone className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobile View</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-10 bg-white shadow-sm text-primary">
              <Tablet className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-10 text-slate-400 hover:text-primary">
              <Monitor className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desktop View</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-9"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </Button>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
        <Button size="sm" className="primary-gradient text-white glow-shadow border-none font-bold h-9 px-5">
          Publish
        </Button>
      </div>
    </header>
  );
}
