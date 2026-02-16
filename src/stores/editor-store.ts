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
  activeTab: 'blocks' | 'theme' | 'settings';
  isPreviewOpen: boolean;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  is3dView: boolean;
  setBlocks: (blocks: Block[]) => void;
  setThemeId: (id: 'creator' | 'minimal' | 'dark') => void;
  setSelectedBlockId: (id: string | null) => void;
  setActiveTab: (tab: 'blocks' | 'theme' | 'settings') => void;
  setIsPreviewOpen: (isOpen: boolean) => void;
  setDeviceView: (view: 'mobile' | 'tablet' | 'desktop') => void;
  setIs3dView: (is3d: boolean) => void;
  addBlock: (type: BlockType, index?: number) => void;
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
  isPreviewOpen: false,
  deviceView: 'mobile',
  is3dView: true,
  setBlocks: (blocks) => set({ blocks }),
  setThemeId: (themeId) => set({ themeId }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsPreviewOpen: (isPreviewOpen) => set({ isPreviewOpen }),
  setDeviceView: (deviceView) => set({ deviceView }),
  setIs3dView: (is3dView) => set({ is3dView }),
  addBlock: (type, index) => set((state) => {
    const newBlock = { id: Math.random().toString(36).substr(2, 9), type, content: {} };
    const newBlocks = [...state.blocks];
    if (typeof index === 'number') {
      newBlocks.splice(index + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    return { 
      blocks: newBlocks,
      selectedBlockId: newBlock.id,
      activeTab: 'blocks'
    };
  }),
  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter((b) => b.id !== id),
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),
  updateBlockContent: (id, content) => set((state) => ({
    blocks: state.blocks.map((b) => b.id === id ? { ...b, content: { ...b.content, ...content } } : b)
  })),
}));
