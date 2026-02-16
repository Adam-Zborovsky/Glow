import { create } from 'zustand';

export type BlockType = 
  | 'link-button' 
  | 'bio' 
  | 'social-icons' 
  | 'image' 
  | 'video' 
  | 'music' 
  | 'header' 
  | 'text';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

interface EditorState {
  blocks: Block[];
  themeId: 'creator' | 'minimal' | 'dark';
  selectedBlockId: string | null;
  activeTab: 'blocks' | 'theme';
  setBlocks: (blocks: Block[]) => void;
  setThemeId: (id: 'creator' | 'minimal' | 'dark') => void;
  setSelectedBlockId: (id: string | null) => void;
  setActiveTab: (tab: 'blocks' | 'theme') => void;
  addBlock: (type: BlockType) => void;
  removeBlock: (id: string) => void;
  updateBlockContent: (id: string, content: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  blocks: [
    { 
      id: 'initial-bio', 
      type: 'bio', 
      content: { 
        name: 'Sarah Chen', 
        title: 'Digital Artist', 
        bio: 'Digital artist specializing in futuristic landscapes and neon aesthetics. Based in Neo-Tokyo.',
        alignment: 'center',
        photoUrl: 'https://i.pravatar.cc/150?u=sarah'
      } 
    },
    {
      id: 'initial-social',
      type: 'social-icons',
      content: {}
    },
    {
      id: 'initial-link-1',
      type: 'link-button',
      content: { label: 'Latest Portfolio' }
    }
  ],
  themeId: 'creator',
  selectedBlockId: 'initial-bio',
  activeTab: 'blocks',
  setBlocks: (blocks) => set({ blocks }),
  setThemeId: (themeId) => set({ themeId }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setActiveTab: (activeTab) => set({ activeTab }),
  addBlock: (type) => set((state) => ({
    blocks: [...state.blocks, { id: Math.random().toString(36).substr(2, 9), type, content: {} }]
  })),
  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter((b) => b.id !== id),
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),
  updateBlockContent: (id, content) => set((state) => ({
    blocks: state.blocks.map((b) => b.id === id ? { ...b, content: { ...b.content, ...content } } : b)
  })),
}));
