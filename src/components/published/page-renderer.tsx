"use client";

import { Block } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Github, 
  Globe, 
  ExternalLink,
  Music,
  Play
} from "lucide-react";
import { recordBlockClick } from "@/lib/actions";

interface PublishedPageProps {
  username: string;
  template: 'creator' | 'minimal' | 'dark';
  blocks: Block[];
  user: {
    name?: string | null;
    avatarUrl?: string | null;
  }
}

export function PageRenderer({ username, template, blocks, user }: PublishedPageProps) {
  const containerClasses = cn(
    "min-h-screen flex flex-col items-center py-12 px-6",
    template === 'creator' && "hero-gradient text-white",
    template === 'minimal' && "bg-white text-slate-900",
    template === 'dark' && "bg-slate-950 text-white"
  );

  const handleBlockClick = async (blockId: string, url?: string) => {
    recordBlockClick(blockId).catch(console.error);
    if (url) {
      // In a real app, we might want to wait a few ms or use a beacon
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {blocks.map((block) => (
          <div key={block.id} className="w-full mb-6">
            <RenderPublishedBlock 
              block={block} 
              template={template} 
              onBlockClick={handleBlockClick}
            />
          </div>
        ))}

        {/* Footer / Badge */}
        <footer className="mt-12 py-8 flex flex-col items-center gap-4 opacity-60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-widest">Powered by</span>
            <span className="text-sm font-bold tracking-tighter text-gradient">glow</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RenderPublishedBlock({ 
  block, 
  template, 
  onBlockClick 
}: { 
  block: Block, 
  template: string, 
  onBlockClick: (id: string, url?: string) => void 
}) {
  switch (block.type) {
    case 'bio':
      return (
        <div className={cn(
          "flex flex-col items-center w-full",
          block.content.alignment === 'left' ? 'items-start text-left' : 
          block.content.alignment === 'right' ? 'items-end text-right' : 'items-center text-center'
        )}>
          <div className={cn(
            "w-24 h-24 rounded-full border-4 mb-6 overflow-hidden shadow-2xl",
            template === 'minimal' ? "border-slate-100" : "border-white/20"
          )}>
            <img 
              src={block.content.photoUrl || "https://i.pravatar.cc/150"} 
              alt={block.content.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight mb-1",
            template === 'minimal' ? "text-slate-900" : "text-white"
          )}>
            {block.content.name || 'Your Name'}
          </h1>
          <p className={cn(
            "text-sm font-medium opacity-80 mb-4",
            template === 'minimal' ? "text-slate-500" : "text-white/80"
          )}>
            {block.content.title || 'Your Title'}
          </p>
          {block.content.bio && (
            <p className={cn(
              "text-sm leading-relaxed max-w-[300px]",
              template === 'minimal' ? "text-slate-600" : "text-white/70"
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
        <div className="flex gap-4 justify-center py-4 flex-wrap">
          {activeSocials.length > 0 ? (
            activeSocials.map((platform) => (
              <div 
                key={platform.id} 
                onClick={() => onBlockClick(block.id, block.content[platform.id])}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer",
                  template === 'minimal' 
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                    : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20"
                )}
              >
                <platform.icon className="w-5 h-5" />
              </div>
            ))
          ) : (
            // Fallback for empty social icons in published view (shouldn't really happen if filtered)
            null
          )}
        </div>
      );

    case 'link-button':
      return (
        <div 
          onClick={() => onBlockClick(block.id, block.content.url)}
          className={cn(
            "w-full py-4 rounded-2xl text-center font-bold text-base shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer flex items-center justify-center relative",
            template === 'minimal'
              ? "bg-white border border-slate-200 text-slate-900 hover:shadow-md"
              : "bg-white/15 text-white backdrop-blur-lg border border-white/20 hover:bg-white/25"
          )}
        >
          {block.content.label || 'View Link'}
          <ExternalLink className="w-4 h-4 absolute right-6 opacity-40" />
        </div>
      );

    case 'header':
      return (
        <div className="w-full py-2">
          <h3 className={cn(
            "text-xl font-bold tracking-tight",
            template === 'minimal' ? "text-slate-900" : "text-white"
          )}>
            {block.content.text || 'Section Header'}
          </h3>
        </div>
      );

    case 'text':
      return (
        <div className={cn(
          "w-full text-sm leading-relaxed",
          template === 'minimal' ? "text-slate-600" : "text-white/80"
        )}>
          {block.content.text}
        </div>
      );

    case 'image':
      return (
        <div 
          onClick={() => onBlockClick(block.id, block.content.url)}
          className={cn(
            "w-full aspect-video rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            template === 'minimal' ? "bg-slate-100" : "bg-white/10"
          )}
        >
          {block.content.url && (
            <img src={block.content.url} alt="Content" className="w-full h-full object-cover" />
          )}
        </div>
      );

    case 'video':
      return (
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-black">
          {block.content.url && (
            <iframe 
              src={block.content.url.replace('watch?v=', 'embed/')} 
              className="w-full h-full"
              allowFullScreen
            />
          )}
        </div>
      );

    case 'music':
      return (
        <div 
          onClick={() => onBlockClick(block.id, block.content.url)}
          className={cn(
            "w-full p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            template === 'minimal' ? "bg-slate-50 border border-slate-100" : "bg-white/10 border border-white/10"
          )}
        >
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-white shrink-0">
            <Music className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">Midnight Drive</p>
            <p className="text-xs opacity-60 truncate">Sarah Chen</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            template === 'minimal' ? "bg-primary text-white" : "bg-white text-primary"
          )}>
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      );

    default:
      return null;
  }
}
