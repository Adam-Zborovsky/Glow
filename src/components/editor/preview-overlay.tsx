"use client";

import { useEditorStore } from "@/stores/editor-store";
import { PageRenderer } from "@/components/published/page-renderer";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewOverlay() {
  const { isPreviewOpen, setIsPreviewOpen, blocks, themeId } = useEditorStore();

  if (!isPreviewOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Preview Mode</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsPreviewOpen(false)}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Close Preview
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <PageRenderer 
          username="preview"
          template={themeId}
          blocks={blocks}
          user={{ name: "Preview User" }}
        />
      </div>
    </div>
  );
}
