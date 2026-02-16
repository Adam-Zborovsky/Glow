"use server";

import { prisma } from "@/lib/db";
import { auth, signIn } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

// ═══════════════════════════════════════
// AUTH ACTIONS
// ═══════════════════════════════════════

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
    console.error("Registration error:", error);
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
    console.error("Login error:", error);
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

import { saveBlocksSchema } from "./validation";
import { rateLimit } from "./rate-limit";

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
      console.error("Save blocks unauthorized: No session or user ID", { session });
      throw new Error("Unauthorized");
    }

    // Rate limiting: 20 saves per minute (increased for better UX)
    const isAllowed = rateLimit(`save_${session.user.id}`, 20, 60000);
    if (!isAllowed) throw new Error("Too many requests. Please wait a minute.");

    // Validation
    const validated = saveBlocksSchema.safeParse({ pageId, blocks, themeId });
    if (!validated.success) {
      console.error("Validation error:", JSON.stringify(validated.error.format(), null, 2));
      const firstError = validated.error.errors[0];
      throw new Error("Invalid block data: " + (firstError ? firstError.message : "Unknown error"));
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
      console.error("Save blocks: Page not found or unauthorized", { pageId, userId: session.user.id });
      throw new Error("Page not found or unauthorized");
    }

    // Simple implementation: delete all and recreate
    await prisma.$transaction([
      prisma.page.update({
        where: { id: pageId },
        data: { themeId: validatedThemeId || "creator" }
      }),
      prisma.block.deleteMany({ where: { pageId } }),
      prisma.block.createMany({
        data: sanitizedBlocks.map((block, index) => ({
          // If it's a new block (random id from client), let Prisma generate a CUID
          id: (block.id.includes('-') && !block.id.startsWith('initial')) || block.id.length < 5 ? undefined : block.id,
          pageId,
          type: block.type.toUpperCase().replace('-', '_'),
          content: JSON.stringify(block.content),
          sortOrder: index,
        }))
      })
    ]);

    revalidatePath(`/editor/${pageId}`);
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) revalidatePath(`/${user.username}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Save blocks error:", error);
    throw new Error(error.message || "Failed to save changes");
  }
}

export async function publishPage(pageId: string, published: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.error("Publish page unauthorized: No session or user ID", { session });
      throw new Error("Unauthorized");
    }

    // Check ownership first since update only takes a unique selector
    const page = await prisma.page.findFirst({
      where: { id: pageId, userId: session.user.id }
    });

    if (!page) {
      console.error("Publish page: Page not found or unauthorized", { pageId, userId: session.user.id });
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
    console.error("Publish page error:", error);
    throw new Error(error.message || "Failed to update published status");
  }
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
