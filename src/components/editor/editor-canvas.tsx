"use client";

import { useEditorStore, Block } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { Plus, Edit2, Instagram, Youtube, Twitter, Linkedin, Github } from "lucide-react";

export function EditorCanvas() {
  const { blocks, selectedBlockId, setSelectedBlockId, themeId } = useEditorStore();

  return (
    <main className="flex-1 bg-slate-50 flex items-center justify-center p-12 overflow-y-auto min-h-0 text-slate-900">
      <div className="iphone-frame relative w-[340px] h-[700px] bg-black rounded-[50px] overflow-hidden shadow-2xl shrink-0">
        {/* Inner Screen */}
        <div className={cn(
          "absolute inset-0 p-8 flex flex-col items-center overflow-y-auto custom-scrollbar transition-all duration-500",
          themeId === 'creator' && "hero-gradient text-white",
          themeId === 'minimal' && "bg-white text-slate-900",
          themeId === 'dark' && "bg-slate-950 text-white"
        )}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-20"></div>
          
          <div className="w-full mt-12 space-y-6 flex flex-col items-center pb-12">
            {blocks.map((block) => (
              <div 
                key={block.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(block.id);
                }}
                className={cn(
                  "relative w-full transition-all cursor-pointer group",
                  selectedBlockId === block.id 
                    ? "ring-2 ring-primary ring-offset-4 ring-offset-primary/20 scale-[1.02]" 
                    : "hover:scale-[1.01]"
                )}
              >
                <RenderBlock block={block} isSelected={selectedBlockId === block.id} themeId={themeId} />
                
                {selectedBlockId === block.id && (
                  <div className="absolute -top-3 -right-3 bg-primary text-white p-1.5 rounded-full shadow-lg z-10 scale-100 animate-in zoom-in-50 duration-200">
                    <Edit2 className="w-3 h-3" />
                  </div>
                )}

                {/* Insertion Point */}
                <div className="absolute -bottom-4 left-0 right-0 h-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-75 hover:scale-100 transition-transform">
                        <Plus className="w-4 h-4" />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function RenderBlock({ block, isSelected, themeId }: { block: Block, isSelected: boolean, themeId: string }) {
  const isDark = themeId === 'dark' || themeId === 'creator';
  
  switch (block.type) {
    case 'bio':
      return (
        <div className={cn(
          "flex flex-col items-center p-4 rounded-2xl w-full",
          block.content.alignment === 'left' ? 'items-start text-left' : 
          block.content.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'
        )}>
          <div className={cn(
            "w-20 h-20 rounded-full border-2 mb-4 overflow-hidden bg-slate-200 shadow-xl",
            themeId === 'minimal' ? "border-slate-100" : "border-white/40"
          )}>
            <img 
              src={block.content.photoUrl || "https://i.pravatar.cc/150?u=sarah"} 
              alt={block.content.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h2 className={cn(
            "text-xl font-bold tracking-tight",
            themeId === 'minimal' ? "text-slate-900" : "text-white"
          )}>{block.content.name || 'Your Name'}</h2>
          <p className={cn(
            "text-sm font-medium mt-1",
            themeId === 'minimal' ? "text-slate-500" : "text-white/80"
          )}>{block.content.title || 'Your Title'}</p>
          {block.content.bio && (
            <p className={cn(
              "text-xs mt-3 leading-relaxed max-w-[200px]",
              themeId === 'minimal' ? "text-slate-600" : "text-white/70"
            )}>
              {block.content.bio}
            </p>
          )}
        </div>
      );
    
    case 'social-icons':
      return (
        <div className="flex gap-4 justify-center py-2">
          {[Instagram, Youtube, Twitter, Github].map((Icon, i) => (
            <div key={i} className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              themeId === 'minimal' 
                ? "bg-slate-100 text-slate-600" 
                : "bg-white/20 border-white/30 backdrop-blur-md text-white border"
            )}>
              <Icon className="w-5 h-5" />
            </div>
          ))}
        </div>
      );

    case 'link-button':
      return (
        <div className={cn(
          "w-full py-4 rounded-2xl text-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]",
          themeId === 'minimal'
            ? "bg-white border border-slate-200 text-slate-900"
            : "bg-white/20 border-white/30 backdrop-blur-md text-white border"
        )}>
          {block.content.label || 'New Link'}
        </div>
      );

    default:
      return (
        <div className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-center text-white/40 text-xs italic">
          {block.type} block placeholder
        </div>
      );
  }
}
