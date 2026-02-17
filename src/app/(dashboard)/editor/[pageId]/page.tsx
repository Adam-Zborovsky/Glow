"use client";

import { EditorNav } from "@/components/editor/editor-nav";
import { BlockSidebar } from "@/components/editor/block-sidebar";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import { SettingsPanel } from "@/components/editor/settings-panel";
import { PreviewOverlay } from "@/components/editor/preview-overlay";
import { getPageWithBlocks } from "@/lib/actions";
import { notFound, useParams } from "next/navigation";
import { HydrateEditor } from "@/components/editor/hydrate-editor";
import { useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { activeTab, setActiveTab, selectedBlockId, setSelectedBlockId } = useEditorStore();

  useEffect(() => {
    async function loadPage() {
      const data = await getPageWithBlocks(pageId);
      if (!data) {
        notFound();
      }
      setPage(data);
      setLoading(false);
    }
    loadPage();
  }, [pageId]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
          <div className="h-4 w-24 bg-slate-50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
      <HydrateEditor 
        blocks={page.blocks} 
        themeId={page.themeId} 
        title={page.title}
        seoTitle={page.seoTitle || ''}
        seoDesc={page.seoDesc || ''}
      />
      <PreviewOverlay />
      <EditorNav initialPublished={page.published} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebars */}
        <div className="hidden lg:flex border-r border-slate-200">
          <BlockSidebar />
        </div>
        
        <EditorCanvas />
        
        <div className="hidden lg:flex border-l border-slate-200">
          <SettingsPanel />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around px-6 pb-4 z-40">
          <MobileNavButton 
            icon={LayoutGrid} 
            label="Blocks" 
            isActive={activeTab === 'blocks'} 
            onClick={() => setActiveTab('blocks')} 
          />
          <MobileNavButton 
            icon={Palette} 
            label="Theme" 
            isActive={activeTab === 'theme'} 
            onClick={() => setActiveTab('theme')} 
          />
          <MobileNavButton 
            icon={Settings} 
            label="Settings" 
            isActive={activeTab === 'settings' || !!selectedBlockId} 
            onClick={() => {
              if (selectedBlockId) {
                // Keep current selection
              } else {
                setActiveTab('settings');
              }
            }} 
          />
        </div>

        {/* Mobile Drawers (Sheets) */}
        <Sheet open={activeTab !== null && (activeTab === 'blocks' || activeTab === 'theme' || activeTab === 'settings')} onOpenChange={(open) => !open && setActiveTab('blocks')}>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] px-0 pb-0 border-none shadow-2xl overflow-hidden flex flex-col">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
            <div className="flex-1 overflow-hidden">
               {activeTab === 'blocks' || activeTab === 'theme' || activeTab === 'settings' ? (
                 <div className="h-full flex flex-col">
                    <div className="px-6 py-2 border-b border-slate-50 flex items-center justify-between">
                       <SheetTitle className="text-lg font-bold capitalize">{activeTab}</SheetTitle>
                       <Button variant="ghost" size="sm" onClick={() => setActiveTab('blocks')} className="text-slate-400">Close</Button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <BlockSidebar hideNav />
                    </div>
                 </div>
               ) : null}
            </div>
          </SheetContent>
        </Sheet>

        {/* Settings Sheet (Triggers when block selected) */}
        <Sheet open={!!selectedBlockId} onOpenChange={(open) => !open && setSelectedBlockId(null)}>
           <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] px-0 pb-0 border-none shadow-2xl overflow-hidden flex flex-col">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <SettingsPanel />
            </div>
           </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function MobileNavButton({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 group transition-all",
        isActive ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        isActive ? "bg-primary/10 shadow-sm" : "group-hover:bg-slate-50"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
