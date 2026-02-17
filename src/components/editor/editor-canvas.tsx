"use client";

import { useEditorStore, Block, BlockType } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Github, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlock } from "./sortable-block";

export function EditorCanvas() {
  const { 
    blocks, 
    selectedBlockId, 
    setSelectedBlockId, 
    themeId, 
    deviceView, 
    is3dView, 
    setIs3dView, 
    addBlock, 
    removeBlock,
    reorderBlocks
  } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

  return (
    <main className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4 md:p-12 overflow-y-auto min-h-0 text-slate-900 relative">
      {/* 3D Toggle */}
      <div className="absolute top-6 right-6 z-20 hidden md:block">
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
        "relative transition-all duration-500 ease-in-out shrink-0 max-w-full",
        is3dView ? "iphone-frame" : "iphone-frame-flat",
        deviceView === 'mobile' && "w-full max-w-[340px] aspect-[9/18.5] md:h-[700px]",
        deviceView === 'tablet' && "w-full max-w-[500px] aspect-[3/4] md:h-[700px]",
        deviceView === 'desktop' && "w-full max-w-[800px] aspect-[16/10] md:h-[700px]"
      )}>
        {/* Frame Border (visual only) */}
        <div className="absolute inset-0 bg-black rounded-[40px] md:rounded-[50px] shadow-2xl pointer-events-none"></div>

        {/* Inner Screen */}
        <div className={cn(
          "absolute inset-1.5 md:inset-2 bg-slate-900 rounded-[34px] md:rounded-[42px] overflow-hidden flex flex-col items-center overflow-y-auto custom-scrollbar transition-all duration-500 isolate [direction:ltr] [transform:translateZ(1px)]",
          themeId === 'creator' && "hero-gradient text-white [--scrollbar-thumb:rgba(255,255,255,0.2)] [--scrollbar-thumb-hover:rgba(255,255,255,0.3)]",
          themeId === 'minimal' && "bg-white text-slate-900 [--scrollbar-thumb:rgba(0,0,0,0.1)] [--scrollbar-thumb-hover:rgba(0,0,0,0.15)]",
          themeId === 'dark' && "bg-slate-950 text-white [--scrollbar-thumb:rgba(255,255,255,0.15)] [--scrollbar-thumb-hover:rgba(255,255,255,0.25)]"
        )}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-28 h-6 md:h-7 bg-black rounded-b-2xl z-20"></div>
          
          <div className="w-full mt-10 md:mt-12 space-y-4 md:space-y-6 flex flex-col items-center pb-12 px-6 md:px-8">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    themeId={themeId}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onRemove={() => removeBlock(block.id)}
                    renderBlock={(props) => <RenderBlock {...props} />}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {/* Empty State / Add First Block */}
            {blocks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] text-center space-y-4 opacity-50">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Add your first block</p>
                <Button variant="outline" size="sm" onClick={() => addBlock('bio')}>Start with Bio</Button>
              </div>
            )}
            
            {/* Quick Add Button at bottom if not empty */}
            {blocks.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full border-2 border-dashed border-current/10 py-8 rounded-2xl opacity-40 hover:opacity-100 transition-opacity gap-2"
                onClick={() => addBlock('link-button')}
              >
                <Plus className="w-4 h-4" />
                Add New Block
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function RenderBlock({ block, isSelected, themeId }: { block: Block, isSelected: boolean, themeId: string }) {
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
      const platforms = [
        { id: 'instagram', icon: Instagram },
        { id: 'youtube', icon: Youtube },
        { id: 'twitter', icon: Twitter },
        { id: 'github', icon: Github },
        { id: 'linkedin', icon: Linkedin },
      ];
      
      const activeSocials = platforms.filter(p => block.content[p.id]);

      return (
        <div className="flex gap-4 justify-center py-2 flex-wrap">
          {activeSocials.length > 0 ? (
            activeSocials.map((platform) => (
              <div key={platform.id} className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110",
                themeId === 'minimal' 
                  ? "bg-slate-100 text-slate-600" 
                  : "bg-white/20 border-white/30 backdrop-blur-md text-white border"
              )}>
                <platform.icon className="w-5 h-5" />
              </div>
            ))
          ) : (
            <div className="text-[10px] opacity-40 uppercase tracking-widest font-bold py-2">
              No social links added
            </div>
          )}
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
