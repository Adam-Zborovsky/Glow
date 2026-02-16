import { PageRenderer } from "@/components/published/page-renderer";
import { notFound } from "next/navigation";
import { getPublicPage, recordPageView } from "@/lib/actions";
import { Metadata } from "next";
import { logger } from "@/lib/logger";

export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;
  const data = await getPublicPage(username, slug);

  if (!data) return { title: "Page Not Found" };

  const bioBlock = data.page.blocks.find(b => b.type === "BIO");
  const bioContent = bioBlock?.content as any;

  return {
    title: `${bioContent?.name || username} | Glow`,
    description: bioContent?.bio || `Check out ${username}'s personal page on Glow.`,
    openGraph: {
      title: `${bioContent?.name || username} | Glow`,
      description: bioContent?.bio,
      images: [bioContent?.photoUrl || "/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${bioContent?.name || username} | Glow`,
      description: bioContent?.bio,
    }
  };
}

export default async function PublishedSubPage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;
  
  // If slug is 'main', it should probably redirect to /[username] 
  // but we can just render it.
  
  const data = await getPublicPage(username, slug);

  if (!data) {
    notFound();
  }

  // Record view in background
  recordPageView(data.page.id, data.page.userId).catch(logger.error);

  const formattedBlocks = data.page.blocks.map(b => ({
    id: b.id,
    type: b.type.toLowerCase().replace('_', '-') as any,
    content: b.content as any
  }));

  return (
    <PageRenderer 
      username={username}
      template={(data.page.themeId as any) || "creator"}
      blocks={formattedBlocks}
      user={data.user}
    />
  );
}
