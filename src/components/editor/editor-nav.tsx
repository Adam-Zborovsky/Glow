"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Tablet, Monitor, Eye, Save, Loader2, Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorStore } from "@/stores/editor-store";
import { saveBlocks, publishPage } from "@/lib/actions";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

export function EditorNav({ initialPublished = false }: { initialPublished?: boolean }) {
  const { blocks, themeId, deviceView, setDeviceView, setIsPreviewOpen } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(initialPublished);
  const params = useParams();
  const pageId = params.pageId as string;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveBlocks(pageId, blocks, themeId);
      if (result?.error) {
        alert(result.error);
      }
    } catch (error) {
      logger.error("Failed to save:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save current changes
      const saveResult = await saveBlocks(pageId, blocks, themeId);
      if (saveResult?.error) {
        alert("Failed to save before publishing: " + saveResult.error);
        setIsPublishing(false);
        return;
      }
      
      // Then toggle published status
      const publishResult = await publishPage(pageId, !isPublished);
      if (publishResult?.success) {
        setIsPublished(!isPublished);
      }
    } catch (error) {
      logger.error("Failed to publish:", error);
      alert("An unexpected error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 md:h-10 md:w-10">
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="font-bold text-xs md:text-sm tracking-tight leading-none truncate max-w-[80px] md:max-w-none">Main Bio</h1>
          <div className="flex items-center gap-1.5 mt-1">
            {isSaving || isPublishing ? (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                <span className="hidden xs:inline">{isSaving ? "Saving..." : "Publishing..."}</span>
              </span>
            ) : (
              <span className="text-[10px] text-emerald-500 font-medium hidden xs:inline">All changes saved</span>
            )}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={deviceView === 'mobile' ? "secondary" : "ghost"} 
              size="icon" 
              className={cn("h-8 w-10", deviceView === 'mobile' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-primary")}
              onClick={() => setDeviceView('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobile View</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={deviceView === 'tablet' ? "secondary" : "ghost"} 
              size="icon" 
              className={cn("h-8 w-10", deviceView === 'tablet' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-primary")}
              onClick={() => setDeviceView('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={deviceView === 'desktop' ? "secondary" : "ghost"} 
              size="icon" 
              className={cn("h-8 w-10", deviceView === 'desktop' ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-primary")}
              onClick={() => setDeviceView('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desktop View</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-8 md:h-9 px-2 md:px-3"
          onClick={handleSave}
          disabled={isSaving || isPublishing}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-8 md:h-9 px-2 md:px-3"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        <Button 
          size="sm" 
          className={cn(
            "text-white glow-shadow border-none font-bold h-8 md:h-9 px-3 md:px-5",
            isPublished ? "bg-slate-900" : "primary-gradient"
          )}
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <span className="hidden sm:inline">{isPublished ? "Unpublish" : "Publish"}</span>
          <span className="sm:hidden">{isPublished ? <Share2 className="w-4 h-4" /> : "Go Live"}</span>
        </Button>
      </div>
    </header>
  );
}
