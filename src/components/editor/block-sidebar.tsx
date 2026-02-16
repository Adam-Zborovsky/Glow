"use client";

import { useEditorStore, BlockType } from "@/stores/editor-store";
import { 
  Type, 
  User, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Layout,
  Palette,
  Settings,
  Share2,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const availableBlocks: { type: BlockType; label: string; icon: any }[] = [
  { type: 'bio', label: 'Bio Block', icon: User },
  { type: 'link-button', label: 'Link Button', icon: LinkIcon },
  { type: 'social-icons', label: 'Social Icons', icon: Share2 },
  { type: 'header', label: 'Section Header', icon: Type },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'video', label: 'Video Embed', icon: Video },
  { type: 'music', label: 'Music Player', icon: Music },
  { type: 'text', label: 'Rich Text', icon: Layout },
];

export function BlockSidebar() {
  const { addBlock, blocks, activeTab, setActiveTab, themeId, setThemeId } = useEditorStore();

  return (
    <aside className="w-[280px] border-r border-slate-200 bg-white flex flex-col h-full">
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('blocks')}
          className={cn(
            "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'blocks' ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600"
          )}
        >
          Blocks
        </button>
        <button 
          onClick={() => setActiveTab('theme')}
          className={cn(
            "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'theme' ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600"
          )}
        >
          Theme
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'settings' ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600"
          )}
        >
          Settings
        </button>
      </div>

      <ScrollArea className="flex-1 px-6 pt-6">
        {activeTab === 'blocks' && (
          <div className="space-y-2 pb-6">
            {availableBlocks.map((block) => {
              const count = blocks.filter(b => b.type === block.type).length;
              return (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 transition-all group hover:border-primary/50 hover:bg-primary/5",
                    count > 0 && "border-primary/20 bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    count > 0 ? "bg-primary/20 text-primary" : "bg-slate-50 text-slate-500 group-hover:text-primary"
                  )}>
                    <block.icon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    count > 0 ? "text-slate-900" : "text-slate-700"
                  )}>
                    {block.label}
                  </span>
                  {count > 0 && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6 pb-6">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Template</h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'creator', label: 'Creator', desc: 'Vibrant & Bold', color: 'hero-gradient' },
                  { id: 'minimal', label: 'Minimal', desc: 'Clean & Simple', color: 'bg-white border-slate-200 border' },
                  { id: 'dark', label: 'Midnight', desc: 'Dark & Moody', color: 'bg-slate-950' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id as any)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all group",
                      themeId === t.id ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className={cn("w-full h-20 rounded-lg mb-3", t.color)}></div>
                    <p className="text-sm font-bold text-slate-900">{t.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 pb-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page Settings</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Page Title</label>
                  <input 
                    type="text" 
                    placeholder="My Awesome Page"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Search Description (SEO)</label>
                  <textarea 
                    placeholder="Briefly describe what this page is about..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="pt-2">
                   <button className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                    Update SEO Settings
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-6 mt-auto border-t border-slate-100">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 p-2 rounded-lg transition-all",
            activeTab === 'settings' ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
