"use client";

import { useEditorStore } from "@/stores/editor-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Instagram,
  Image as ImageIcon,
  Youtube,
  Twitter,
  Github,
  Linkedin
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./image-upload";

const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@channel' },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { id: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
];

export function SettingsPanel() {
  const { blocks, selectedBlockId, updateBlockContent, removeBlock } = useEditorStore();
  
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <Settings className="w-6 h-6 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-900">No block selected</h3>
        <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-bold text-[10px]">Select a block on the canvas to customize its settings.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white lg:w-[360px] lg:border-l border-slate-200">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Block Settings</h3>
          <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-bold text-[10px]">
            {selectedBlock.type.replace('-', ' ')}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeBlock(selectedBlock.id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Block</TooltipContent>
        </Tooltip>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {selectedBlock.type === 'social-icons' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Social Profiles</Label>
                <p className="text-xs text-slate-500">Add your social media profile URLs below.</p>
              </div>
              <div className="space-y-4">
                {socialPlatforms.map((platform) => (
                  <div key={platform.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <platform.icon className="w-3.5 h-3.5 text-slate-400" />
                      <Label className="text-xs font-bold text-slate-700">{platform.label}</Label>
                    </div>
                    <Input 
                      value={selectedBlock.content[platform.id] || ''} 
                      onChange={(e) => updateBlockContent(selectedBlock.id, { [platform.id]: e.target.value })}
                      placeholder={platform.placeholder}
                      className="h-10 bg-slate-50 border-slate-200 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBlock.type === 'bio' && (
            <>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Picture</Label>
                <div className="flex items-start gap-6">
                  <div 
                    className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden relative shrink-0"
                  >
                    <img 
                      src={selectedBlock.content.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-4 flex-1">
                    <ImageUpload 
                      value={selectedBlock.content.photoUrl || ''} 
                      onChange={(url) => updateBlockContent(selectedBlock.id, { photoUrl: url })}
                    />
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <Label className="text-xs font-bold text-slate-700">Or use Image URL</Label>
                      <Input 
                        value={selectedBlock.content.photoUrl || ''} 
                        onChange={(e) => updateBlockContent(selectedBlock.id, { photoUrl: e.target.value })}
                        placeholder="https://..."
                        className="h-10 bg-slate-50 border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Display Name</Label>
                  <Input 
                    value={selectedBlock.content.name || ''} 
                    onChange={(e) => updateBlockContent(selectedBlock.id, { name: e.target.value })}
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Title</Label>
                  <Input 
                    value={selectedBlock.content.title || ''} 
                    onChange={(e) => updateBlockContent(selectedBlock.id, { title: e.target.value })}
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bio Text</Label>
                  <Textarea 
                    value={selectedBlock.content.bio || ''} 
                    onChange={(e) => updateBlockContent(selectedBlock.id, { bio: e.target.value })}
                    className="bg-slate-50 border-slate-200 min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alignment</Label>
                <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
                  {[
                    { val: 'left', icon: AlignLeft },
                    { val: 'center', icon: AlignCenter },
                    { val: 'right', icon: AlignRight }
                  ].map((align) => (
                    <button
                      key={align.val}
                      onClick={() => updateBlockContent(selectedBlock.id, { alignment: align.val })}
                      className={cn(
                        "p-2 flex items-center justify-center rounded-lg transition-all",
                        selectedBlock.content.alignment === align.val 
                          ? "bg-white shadow-sm text-primary" 
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      <align.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedBlock.type === 'link-button' && (
             <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button Label</Label>
                  <Input 
                    value={selectedBlock.content.label || ''} 
                    onChange={(e) => updateBlockContent(selectedBlock.id, { label: e.target.value })}
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination URL</Label>
                  <Input 
                    value={selectedBlock.content.url || ''} 
                    onChange={(e) => updateBlockContent(selectedBlock.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
             </div>
          )}

          {selectedBlock.type === 'header' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Header Text</Label>
                <Input 
                  value={selectedBlock.content.text || ''} 
                  onChange={(e) => updateBlockContent(selectedBlock.id, { text: e.target.value })}
                  placeholder="My Projects"
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          )}

          {selectedBlock.type === 'text' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content</Label>
                <Textarea 
                  value={selectedBlock.content.text || ''} 
                  onChange={(e) => updateBlockContent(selectedBlock.id, { text: e.target.value })}
                  className="bg-slate-50 border-slate-200 min-h-[200px] resize-none"
                />
              </div>
            </div>
          )}

          {selectedBlock.type === 'image' && (
            <div className="space-y-5">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image Content</Label>
                <div 
                  className="w-full aspect-video rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden relative"
                >
                  {selectedBlock.content.url ? (
                    <img src={selectedBlock.content.url} alt="Content" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold">Preview</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <ImageUpload 
                    value={selectedBlock.content.url || ''} 
                    onChange={(url) => updateBlockContent(selectedBlock.id, { url })}
                  />
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <Label className="text-xs font-bold text-slate-700">Or use Image URL</Label>
                    <Input 
                      value={selectedBlock.content.url || ''} 
                      onChange={(e) => updateBlockContent(selectedBlock.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="h-10 bg-slate-50 border-slate-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedBlock.type === 'video' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Video URL (YouTube/Vimeo)</Label>
                <Input 
                  value={selectedBlock.content.url || ''} 
                  onChange={(e) => updateBlockContent(selectedBlock.id, { url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          )}

          {selectedBlock.type === 'music' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spotify/Apple Music URL</Label>
                <Input 
                  value={selectedBlock.content.url || ''} 
                  onChange={(e) => updateBlockContent(selectedBlock.id, { url: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => removeBlock(selectedBlock.id)}
          className="w-full py-6 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete Block
        </Button>
      </div>
    </div>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
