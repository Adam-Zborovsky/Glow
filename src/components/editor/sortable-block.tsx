"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  themeId: string;
  onSelect: () => void;
  onRemove: () => void;
  renderBlock: (props: { block: Block, isSelected: boolean, themeId: string }) => React.ReactNode;
}

export function SortableBlock({ 
  block, 
  isSelected, 
  themeId, 
  onSelect, 
  onRemove,
  renderBlock 
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "relative w-full transition-all cursor-pointer group rounded-2xl",
        isSelected 
          ? "ring-2 ring-primary ring-offset-4 ring-offset-primary/20 scale-[1.02]" 
          : "hover:scale-[1.01]",
        isDragging && "scale-105 shadow-2xl"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-slate-400 hover:text-primary hidden md:block"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {renderBlock({ block, isSelected, themeId })}
      
      {isSelected && !isDragging && (
        <div className="absolute -top-3 -right-3 flex gap-1.5 z-10 scale-100 animate-in zoom-in-50 duration-200">
          <div className="bg-primary text-white p-1.5 rounded-full shadow-lg">
            <Edit2 className="w-3 h-3" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
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
    </div>
  );
}
