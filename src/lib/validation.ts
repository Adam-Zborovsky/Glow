import { z } from "zod";

export const blockContentSchema = z.union([
  z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    bio: z.string().optional(),
    alignment: z.enum(["left", "center", "right"]).optional(),
    photoUrl: z.string().url().optional().or(z.literal("")),
  }),
  z.object({
    label: z.string().optional(),
    url: z.string().url().optional().or(z.literal("")),
  }),
  z.object({
    text: z.string().optional(),
  }),
  z.object({
    url: z.string().url().optional().or(z.literal("")),
  }),
  z.record(z.string(), z.any()) // Fallback for other blocks
]);

export const blockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'link-button', 
    'bio', 
    'social-icons', 
    'image', 
    'video', 
    'music', 
    'header', 
    'text'
  ]),
  content: blockContentSchema,
});

export const saveBlocksSchema = z.object({
  pageId: z.string(),
  blocks: z.array(blockSchema),
  themeId: z.enum(['creator', 'minimal', 'dark']).optional(),
});

export const updatePageMetadataSchema = z.object({
  pageId: z.string(),
  title: z.string().min(1, "Title is required").max(100),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const fileSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE, "File size must be less than 2MB"),
  type: z.string().refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), "Only .jpg, .jpeg, .png and .webp formats are supported"),
});
