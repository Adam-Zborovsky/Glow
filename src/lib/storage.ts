import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileSchema } from "./validation";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Handles file storage (local implementation for development)
 * Can be easily swapped for S3 or Cloudinary.
 */
export async function storeFile(file: File): Promise<string> {
  // Validate file
  const validation = fileSchema.safeParse({
    size: file.size,
    type: file.type,
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  // Ensure uploads directory exists
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }

  // Generate unique filename
  const extension = file.type.split("/")[1];
  const filename = `${uuidv4()}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  // Store file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}
