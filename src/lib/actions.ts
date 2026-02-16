"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BlockType } from "@/stores/editor-store";
import { headers } from "next/headers";

// ═══════════════════════════════════════
// PAGE ACTIONS
// ═══════════════════════════════════════
// ... (previous actions)

// ═══════════════════════════════════════
// ANALYTICS ACTIONS
// ═══════════════════════════════════════

export async function recordPageView(pageId: string, userId: string) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const referrer = headersList.get("referer") || "direct";
  
  // Basic device detection from user agent
  let device: "MOBILE" | "DESKTOP" | "TABLET" = "DESKTOP";
  if (/mobile/i.test(userAgent)) device = "MOBILE";
  if (/tablet/i.test(userAgent)) device = "TABLET";

  await prisma.pageView.create({
    data: {
      pageId,
      userId,
      referrer,
      device,
      browser: userAgent.split(" ")[0], // Simplified
    }
  });
}

export async function recordBlockClick(blockId: string) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const referrer = headersList.get("referer") || "direct";

  let device: "MOBILE" | "DESKTOP" | "TABLET" = "DESKTOP";
  if (/mobile/i.test(userAgent)) device = "MOBILE";
  if (/tablet/i.test(userAgent)) device = "TABLET";

  await prisma.blockClick.create({
    data: {
      blockId,
      referrer,
      device,
    }
  });
}

export async function getAnalyticsSummary() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get views over last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const views = await prisma.pageView.findMany({
    where: {
      userId: session.user.id,
      timestamp: { gte: thirtyDaysAgo }
    },
    select: {
      timestamp: true,
      device: true,
      referrer: true
    }
  });

  const clicks = await prisma.blockClick.findMany({
    where: {
      block: { page: { userId: session.user.id } },
      timestamp: { gte: thirtyDaysAgo }
    }
  });

  return {
    totalViews: views.length,
    totalClicks: clicks.length,
    viewsByDate: views, // In real app, group this on DB
    viewsByDevice: views.reduce((acc: any, v) => {
      const deviceKey = v.device || 'DESKTOP';
      acc[deviceKey] = (acc[deviceKey] || 0) + 1;
      return acc;
    }, {}),
    topReferrers: views.reduce((acc: any, v) => {
      const ref = v.referrer || "direct";
      acc[ref] = (acc[ref] || 0) + 1;
      return acc;
    }, {})
  };
}

export async function createPage() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  const page = await prisma.page.create({
    data: {
      userId: user.id,
      title: "My New Page",
      slug: `page-${Math.random().toString(36).substr(2, 5)}`,
      blocks: {
        create: [
          {
            type: "BIO",
            sortOrder: 0,
            content: {
              name: user.name || "Your Name",
              title: "Digital Creator",
              bio: "Welcome to my page!",
              alignment: "center",
            },
          },
        ],
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/editor/${page.id}`);
}

export async function getPages() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.page.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { views: true },
      },
    },
  });
}

export async function getPageWithBlocks(pageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const page = await prisma.page.findUnique({
    where: { 
      id: pageId,
      userId: session.user.id
    },
    include: {
      blocks: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  return page;
}

// ═══════════════════════════════════════
// BLOCK ACTIONS
// ═══════════════════════════════════════

export async function saveBlocks(pageId: string, blocks: any[], themeId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership
  const page = await prisma.page.findUnique({
    where: { id: pageId, userId: session.user.id }
  });

  if (!page) throw new Error("Page not found");

  // Simple implementation: delete all and recreate
  // In production, you'd want to upsert/diff for better performance
  await prisma.$transaction([
    prisma.page.update({
      where: { id: pageId },
      data: { themeId: themeId || "creator" }
    }),
    prisma.block.deleteMany({ where: { pageId } }),
    prisma.block.createMany({
      data: blocks.map((block, index) => ({
        id: block.id.startsWith('initial') ? undefined : block.id,
        pageId,
        type: block.type.toUpperCase().replace('-', '_') as any,
        content: block.content,
        sortOrder: index,
      }))
    })
  ]);

  revalidatePath(`/editor/${pageId}`);
  revalidatePath(`/${session.user.username}`);
}

// ═══════════════════════════════════════
// PUBLIC FETCHING
// ═══════════════════════════════════════

export async function getPublicPage(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      pages: {
        where: { slug: "main" }, // Default to main page
        include: {
          blocks: {
            where: { visible: true },
            orderBy: { sortOrder: "asc" }
          }
        }
      }
    }
  });

  if (!user || user.pages.length === 0) return null;

  return {
    user: {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    page: user.pages[0],
  };
}
