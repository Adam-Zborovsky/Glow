"use client";

import { useEffect, useRef } from "react";
import { useEditorStore, Block } from "@/stores/editor-store";

export function HydrateEditor({ blocks, themeId, title, seoTitle, seoDesc }: { blocks: any[], themeId?: string, title?: string, seoTitle?: string, seoDesc?: string }) {
  const setBlocks = useEditorStore((state) => state.setBlocks);
  const setThemeId = useEditorStore((state) => state.setThemeId);
  const setPageSettings = useEditorStore((state) => state.setPageSettings);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const validThemes = ['creator', 'minimal', 'dark'];
      const themeToSet = themeId && validThemes.includes(themeId) ? themeId : 'creator';
      setThemeId(themeToSet as any);
      
      setPageSettings({
        title: title || '',
        seoTitle: seoTitle || '',
        seoDesc: seoDesc || '',
      });

      const formattedBlocks: Block[] = blocks.map((b) => ({
        id: b.id,
        type: b.type.toLowerCase().replace('_', '-') as any,
        content: b.content,
      }));
      setBlocks(formattedBlocks);
      initialized.current = true;
    }
  }, [blocks, themeId, setBlocks, setThemeId]);

  return null;
}
