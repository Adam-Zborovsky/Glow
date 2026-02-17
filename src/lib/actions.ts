"use server";

import { prisma } from "@/lib/db";
import { auth, signIn } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { saveBlocksSchema, updatePageMetadataSchema, fileSchema } from "./validation";
import { rateLimit } from "./rate-limit";
import { logger } from "./logger";
import { storeFile } from "./storage";

// ═══════════════════════════════════════
// AUTH ACTIONS
// ═══════════════════════════════════════

export async function uploadFile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // Validate file
  const validation = fileSchema.safeParse({
    size: file.size,
    type: file.type,
  });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    const url = await storeFile(file);
    return { url };
  } catch (error: any) {
    logger.error("Upload error:", error);
    return { error: error.message || "Something went wrong during upload" };
  }
}

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  try {
    // Check if username is taken (if it's changing)
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: session.user.id }
      }
    });

    if (existingUser) return { error: "Username is already taken" };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name, 
        username,
        avatarUrl: avatarUrl || undefined
      }
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    logger.error("Update profile error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function register(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  // Rate limiting: 5 registrations per hour
  const isAllowed = rateLimit(`reg_${email}`, 5, 3600000);
  if (!isAllowed) return { error: "Too many attempts. Please try again later." };

  if (!email || !password || !username) {
    return { error: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return { error: "User with this email or username already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        name: username, // Default name to username
        // Create an initial page for the user
        pages: {
          create: {
            slug: "main",
            title: `${username}'s Page`,
            blocks: {
              create: [
                {
                  type: "BIO",
                  sortOrder: 0,
                  content: JSON.stringify({
                    name: username,
                    title: "Digital Creator",
                    bio: "Welcome to my page!",
                    alignment: "center",
                  }),
                },
              ],
            },
          }
        }
      }
    });

    // Automatically sign in after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return { error: "Invalid credentials during auto-login" };
    }
    // Auth.js redirects by throwing a special error, we must rethrow it
    if ((error as any).message === "NEXT_REDIRECT" || (error as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    logger.error("Registration error:", error);
    return { error: "Something went wrong during registration" };
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Rate limiting: 10 logins per 15 minutes
  const isAllowed = rateLimit(`login_${email}`, 10, 900000);
  if (!isAllowed) return { error: "Too many login attempts. Please try again in 15 minutes." };

  if (!email || !password) {
    return { error: "Missing email or password" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }
    // Auth.js redirects by throwing a special error, we must rethrow it
    if ((error as any).message === "NEXT_REDIRECT" || (error as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    logger.error("Login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// ═══════════════════════════════════════
// PAGE ACTIONS
// ═══════════════════════════════════════
// ... (previous actions)

// ═══════════════════════════════════════
// ANALYTICS ACTIONS
// ═══════════════════════════════════════

export async function recordPageView(pageId: string, userId: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  // Rate limit: 60 views per minute per IP
  const isAllowed = rateLimit(`view_${ip}_${pageId}`, 60, 60000);
  if (!isAllowed) return;

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
      device: device as string,
      browser: userAgent.split(" ")[0], // Simplified
    }
  });
}

export async function recordBlockClick(blockId: string, url?: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  // Rate limit: 100 clicks per minute per IP
  const isAllowed = rateLimit(`click_${ip}_${blockId}`, 100, 60000);
  if (!isAllowed) return;

  const userAgent = headersList.get("user-agent") || "";
  const referrer = headersList.get("referer") || "direct";

  let device: "MOBILE" | "DESKTOP" | "TABLET" = "DESKTOP";
  if (/mobile/i.test(userAgent)) device = "MOBILE";
  if (/tablet/i.test(userAgent)) device = "TABLET";

  await prisma.blockClick.create({
    data: {
      blockId,
      url,
      referrer,
      device: device as string,
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
            content: JSON.stringify({
              name: user.name || "Your Name",
              title: "Digital Creator",
              bio: "Welcome to my page!",
              alignment: "center",
            }),
          },
        ],
      },
    },
  });

  revalidatePath("/dashboard");
  redirect(`/editor/${page.id}`);
}

export async function deletePage(pageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.page.delete({
    where: { 
      id: pageId,
      userId: session.user.id
    }
  });

  revalidatePath("/dashboard");
}

export async function duplicatePage(pageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const page = await prisma.page.findFirst({
    where: { 
      id: pageId,
      userId: session.user.id
    },
    include: {
      blocks: true
    }
  });

  if (!page) throw new Error("Page not found");

  const newPage = await prisma.page.create({
    data: {
      userId: session.user.id,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-${Math.random().toString(36).substr(2, 5)}`,
      themeId: page.themeId,
      published: false,
      blocks: {
        create: page.blocks.map(block => ({
          type: block.type,
          content: block.content,
          sortOrder: block.sortOrder,
          visible: block.visible
        }))
      }
    }
  });

  revalidatePath("/dashboard");
  return newPage;
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

  const page = await prisma.page.findFirst({
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

  if (!page) return null;

  return {
    ...page,
    customTheme: page.customTheme ? JSON.parse(page.customTheme as string) : null,
    blocks: page.blocks.map(block => ({
      ...block,
      content: JSON.parse(block.content as string)
    }))
  };
}

// Simple sanitization function
function sanitize(text: string): string {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') return sanitize(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = sanitizeObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// ═══════════════════════════════════════
// BLOCK ACTIONS
// ═══════════════════════════════════════

export async function saveBlocks(pageId: string, blocks: any[], themeId?: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      logger.error("Save blocks unauthorized: No session or user ID");
      throw new Error("Unauthorized");
    }

    // Rate limiting: 20 saves per minute (increased for better UX)
    const isAllowed = rateLimit(`save_${session.user.id}`, 20, 60000);
    if (!isAllowed) throw new Error("Too many requests. Please wait a minute.");

    // Validation
    const validated = saveBlocksSchema.safeParse({ pageId, blocks, themeId });
    if (!validated.success) {
      logger.error("Validation error:", JSON.stringify(validated.error.format(), null, 2));
      throw new Error("Invalid block data");
    }

    const { blocks: validatedBlocks, themeId: validatedThemeId } = validated.data;

    // Sanitization
    const sanitizedBlocks = validatedBlocks.map(block => ({
      ...block,
      content: sanitizeObject(block.content)
    }));

    // Verify ownership
    const page = await prisma.page.findFirst({
      where: { id: pageId, userId: session.user.id }
    });

    if (!page) {
      logger.error("Save blocks: Page not found or unauthorized", { pageId, userId: session.user.id });
      throw new Error("Page not found or unauthorized");
    }

    // Simple implementation: delete all and recreate
    await prisma.$transaction(async (tx) => {
      await tx.page.update({
        where: { id: pageId },
        data: { themeId: validatedThemeId || "creator" }
      });

      await tx.block.deleteMany({ where: { pageId } });

      for (let i = 0; i < sanitizedBlocks.length; i++) {
        const block = sanitizedBlocks[i];
        await tx.block.create({
          data: {
            id: (block.id.includes('-') && !block.id.startsWith('initial')) || block.id.length < 5 ? undefined : block.id,
            pageId,
            type: block.type.toUpperCase().replace('-', '_'),
            content: JSON.stringify(block.content),
            sortOrder: i,
          }
        });
      }
    });

    revalidatePath(`/editor/${pageId}`);
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) revalidatePath(`/${user.username}`);
    
    return { success: true };
  } catch (error: any) {
    logger.error("Save blocks error:", error);
    return { error: "Failed to save changes" };
  }
}

export async function publishPage(pageId: string, published: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      logger.error("Publish page unauthorized: No session or user ID");
      throw new Error("Unauthorized");
    }

    // Check ownership first since update only takes a unique selector
    const page = await prisma.page.findFirst({
      where: { id: pageId, userId: session.user.id }
    });

    if (!page) {
      logger.error("Publish page: Page not found or unauthorized", { pageId, userId: session.user.id });
      throw new Error("Page not found or unauthorized");
    }

    await prisma.page.update({
      where: { id: pageId },
      data: { published }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/editor/${pageId}`);
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) revalidatePath(`/${user.username}`);

    return { success: true };
  } catch (error: any) {
    logger.error("Publish page error:", error);
    return { error: "Failed to update published status" };
  }
}

export async function updatePageMetadata(pageId: string, title: string, seoTitle: string, seoDesc: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      logger.error("Update metadata unauthorized: No session or user ID");
      throw new Error("Unauthorized");
    }

    const validated = updatePageMetadataSchema.safeParse({ pageId, title, seoTitle, seoDesc });
    if (!validated.success) {
      logger.error("Validation error:", JSON.stringify(validated.error.format(), null, 2));
      throw new Error("Invalid metadata");
    }

    const page = await prisma.page.findFirst({
      where: { id: pageId, userId: session.user.id }
    });

    if (!page) {
      logger.error("Update metadata: Page not found or unauthorized", { pageId, userId: session.user.id });
      throw new Error("Page not found or unauthorized");
    }

    await prisma.page.update({
      where: { id: pageId },
      data: {
        title: sanitize(title),
        seoTitle: sanitize(seoTitle),
        seoDesc: sanitize(seoDesc),
      }
    });

    revalidatePath("/dashboard");
    revalidatePath(`/editor/${pageId}`);
    return { success: true };
  } catch (error: any) {
    logger.error("Update metadata error:", error);
    return { error: "Failed to update page metadata" };
  }
}

// ═══════════════════════════════════════
// PUBLIC FETCHING
// ═══════════════════════════════════════

export async function getPublicPage(username: string, slug: string = "main") {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      pages: {
        where: { slug },
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

  const page = user.pages[0];

  return {
    user: {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    page: {
      ...page,
      customTheme: page.customTheme ? JSON.parse(page.customTheme as string) : null,
      blocks: page.blocks.map(block => ({
        ...block,
        content: JSON.parse(block.content as string)
      }))
    },
  };
}
