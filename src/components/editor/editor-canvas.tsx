"use client";

import { useEditorStore, Block, BlockType } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { Plus, Edit2, Trash2, Instagram, Youtube, Twitter, Linkedin, Github, Type, Image as ImageIcon, Video, Music, Heading } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Box } from "lucide-react";

export function EditorCanvas() {
  const { blocks, selectedBlockId, setSelectedBlockId, themeId, deviceView, is3dView, setIs3dView, addBlock, removeBlock } = useEditorStore();

  const handleAddBlock = (e: React.MouseEvent, type: BlockType, index?: number) => {
    e.stopPropagation();
    addBlock(type, index);
  };

  return (
    <main className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 overflow-y-auto min-h-0 text-slate-900 relative">
      {/* 3D Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={is3dView ? "secondary" : "outline"} 
              size="sm" 
              className="gap-2 shadow-sm bg-white"
              onClick={() => setIs3dView(!is3dView)}
            >
              <Box className={cn("w-4 h-4 transition-transform", is3dView && "rotate-12")} />
              {is3dView ? "3D View" : "Flat View"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Perspective</TooltipContent>
        </Tooltip>
      </div>

      <div className={cn(
        "relative transition-all duration-500 ease-in-out shrink-0",
        is3dView ? "iphone-frame" : "iphone-frame-flat",
        deviceView === 'mobile' && "w-[340px] h-[700px]",
        deviceView === 'tablet' && "w-[500px] h-[700px]",
        deviceView === 'desktop' && "w-[800px] h-[700px]"
      )}>
        {/* Frame Border (visual only) */}
        <div className="absolute inset-0 bg-black rounded-[50px] shadow-2xl pointer-events-none"></div>

        {/* Inner Screen */}
        <div className={cn(
          "absolute inset-2 bg-slate-900 rounded-[42px] overflow-hidden flex flex-col items-center overflow-y-auto custom-scrollbar transition-all duration-500 isolate [direction:ltr] [transform:translateZ(1px)]",
          themeId === 'creator' && "hero-gradient text-white [--scrollbar-thumb:rgba(255,255,255,0.2)] [--scrollbar-thumb-hover:rgba(255,255,255,0.3)]",
          themeId === 'minimal' && "bg-white text-slate-900 [--scrollbar-thumb:rgba(0,0,0,0.1)] [--scrollbar-thumb-hover:rgba(0,0,0,0.15)]",
          themeId === 'dark' && "bg-slate-950 text-white [--scrollbar-thumb:rgba(255,255,255,0.15)] [--scrollbar-thumb-hover:rgba(255,255,255,0.25)]"
        )}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-20"></div>
          
          <div className="w-full mt-12 space-y-6 flex flex-col items-center pb-12 px-8">
            {blocks.map((block, index) => (
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
                  <div className="absolute -top-3 -right-3 flex gap-1.5 z-10 scale-100 animate-in zoom-in-50 duration-200">
                    <div className="bg-primary text-white p-1.5 rounded-full shadow-lg">
                      <Edit2 className="w-3 h-3" />
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(block.id);
                          }}
                          className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Block</TooltipContent>
                    </Tooltip>
                  </div>
                )}

                {/* Insertion Point */}
                <div className="absolute -bottom-4 left-0 right-0 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={(e) => handleAddBlock(e, 'link-button', index)}
                          className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-75 hover:scale-100 transition-transform active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Add Block Here</TooltipContent>
                    </Tooltip>
                </div>
              </div>
            ))}

            {/* Empty State / Add First Block */}
            {blocks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4 opacity-50">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Add your first block</p>
                <Button variant="outline" size="sm" onClick={() => addBlock('bio')}>Start with Bio</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function RenderBlock({ block, isSelected, themeId }: { block: Block, isSelected: boolean, themeId: string }) {
  const isDark = themeId === 'dark' || themeId === 'creator';
  const glassClass = "bg-white/20 border-white/30 backdrop-blur-md text-white border";
  const minimalClass = "bg-white border border-slate-200 text-slate-900";
  
  switch (block.type) {
    case 'bio':
      return (
        <div className={cn(
          "flex flex-col items-center p-4 rounded-2xl w-full",
          block.content.alignment === 'left' ? 'items-start text-left' : 
          block.content.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'
        )}>
          <div className={cn(
            "w-20 h-20 rounded-full border-2 mb-4 overflow-hidden bg-slate-200 shadow-xl transition-transform duration-500",
            themeId === 'minimal' ? "border-slate-100" : "border-white/40",
            isSelected && "scale-110"
          )}>
            <img 
              src={block.content.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"} 
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
              "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110",
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
          "w-full py-4 rounded-2xl text-center font-bold text-sm shadow-sm transition-all active:scale-[0.98] hover:shadow-md",
          themeId === 'minimal' ? minimalClass : glassClass
        )}>
          {block.content.label || 'New Link'}
        </div>
      );

    case 'header':
      return (
        <div className="w-full py-2">
          <h3 className={cn(
            "text-lg font-bold tracking-tight",
            themeId === 'minimal' ? "text-slate-900" : "text-white"
          )}>
            {block.content.text || 'Section Header'}
          </h3>
        </div>
      );

    case 'text':
      return (
        <div className={cn(
          "w-full p-4 rounded-2xl text-sm leading-relaxed",
          themeId === 'minimal' ? "text-slate-600" : "text-white/80"
        )}>
          {block.content.text || 'Share more details about yourself, your projects, or anything else you want your visitors to know.'}
        </div>
      );

    case 'image':
      return (
        <div className={cn(
          "w-full aspect-video rounded-2xl overflow-hidden relative group",
          themeId === 'minimal' ? "bg-slate-100" : "bg-white/10 border border-white/20"
        )}>
          {block.content.url ? (
            <img src={block.content.url} alt="Block image" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-current opacity-40">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Image Block</span>
            </div>
          )}
        </div>
      );

    case 'video':
      return (
        <div className={cn(
          "w-full aspect-video rounded-2xl overflow-hidden relative bg-black flex items-center justify-center",
          themeId === 'minimal' ? "border border-slate-200" : "border border-white/20"
        )}>
          <Video className="w-10 h-10 text-white/40" />
          <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-primary"></div>
          </div>
        </div>
      );

    case 'music':
      return (
        <div className={cn(
          "w-full p-4 rounded-2xl flex items-center gap-4",
          themeId === 'minimal' ? minimalClass : glassClass
        )}>
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="h-2 w-24 bg-current/20 rounded-full mb-2"></div>
            <div className="h-1.5 w-16 bg-current/10 rounded-full"></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-1"></div>
          </div>
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
