"use client";

import { useEffect, useRef } from "react";
import { useEditorStore, Block } from "@/stores/editor-store";

export function HydrateEditor({ blocks, themeId }: { blocks: any[], themeId?: string }) {
  const setBlocks = useEditorStore((state) => state.setBlocks);
  const setThemeId = useEditorStore((state) => state.setThemeId);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (themeId) setThemeId(themeId as any);
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
