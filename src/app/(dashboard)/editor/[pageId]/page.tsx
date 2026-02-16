import { EditorNav } from "@/components/editor/editor-nav";
import { BlockSidebar } from "@/components/editor/block-sidebar";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import { SettingsPanel } from "@/components/editor/settings-panel";
import { PreviewOverlay } from "@/components/editor/preview-overlay";
import { getPageWithBlocks } from "@/lib/actions";
import { notFound } from "next/navigation";
import { HydrateEditor } from "@/components/editor/hydrate-editor";

export default async function EditorPage({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = await params;
  const page = await getPageWithBlocks(pageId);

  if (!page) {
    notFound();
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white text-slate-900 font-sans">
      <HydrateEditor 
        blocks={page.blocks} 
        themeId={page.themeId} 
        title={page.title}
        seoTitle={page.seoTitle || ''}
        seoDesc={page.seoDesc || ''}
      />
      <PreviewOverlay />
      <EditorNav initialPublished={page.published} />
      <div className="flex flex-1 overflow-hidden">
        <BlockSidebar />
        <EditorCanvas />
        <SettingsPanel />
      </div>
    </div>
  );
}
