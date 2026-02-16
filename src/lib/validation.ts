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
  z.record(z.any()) // Fallback for other blocks
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
