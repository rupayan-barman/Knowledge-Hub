import { z } from 'zod';

const urlSchema = z
  .string()
  .trim()
  .min(1, 'URL is required')
  .refine((val) => {
    try {
      const url = new URL(val);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Must be a valid http(s) URL');

export const resourceSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  official_url: urlSchema,
  short_description: z.string().trim().min(10, 'Short description must be at least 10 characters').max(200),
  detailed_description: z.string().trim().max(5000).optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().nullable(),
  learning_type: z
    .enum(['documentation', 'video_course', 'interactive', 'book', 'tool', 'article', 'community', 'other'])
    .optional()
    .nullable(),
  personal_review: z.string().trim().max(5000).optional().nullable(),
  advantages: z.array(z.string().trim().min(1).max(200)).max(15).default([]),
  disadvantages: z.array(z.string().trim().min(1).max(200)).max(15).default([]),
  useful_for: z.string().trim().max(300).optional().nullable(),
  status: z.enum(['draft', 'published', 'hidden', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  logo_url: z.string().url().optional().nullable(),
  screenshot_url: z.string().url().optional().nullable(),
  meta_title: z.string().trim().max(70).optional().nullable(),
  meta_description: z.string().trim().max(160).optional().nullable(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional().nullable(),
  icon: z.string().trim().max(60).default('folder'),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, 'Must be a valid hex color')
    .default('#00ff9d'),
  cover_image_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().default(0),
  is_hidden: z.boolean().default(false),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(3000),
  thumbnail_url: z.string().url().optional().nullable(),
  technologies: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
  status: z.enum(['planning', 'in_progress', 'completed', 'archived']).default('in_progress'),
  github_url: urlSchema.optional().or(z.literal('')).nullable(),
  live_url: urlSchema.optional().or(z.literal('')).nullable(),
  gallery: z.array(z.string().url()).max(20).default([]),
  future_improvements: z.string().trim().max(3000).optional().nullable(),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const noteSchema = z.object({
  title: z.string().trim().min(2).max(150),
  content: z.record(z.any()),
  content_text: z.string().trim().default(''),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
  status: z.enum(['draft', 'published', 'hidden', 'archived']).default('draft'),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const settingsSchema = z.object({
  project_name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(200).optional().nullable(),
  homepage_text: z.string().trim().max(1000).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
  favicon_url: z.string().url().optional().nullable(),
  homepage_banner_url: z.string().url().optional().nullable(),
  footer_text: z.string().trim().min(1).max(200),
  theme_default: z.enum(['dark', 'light', 'system']),
  accent_color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, 'Must be a valid hex color'),
  social_links: z.record(z.string().url().or(z.literal(''))).default({}),
  seo_meta_title: z.string().trim().max(70).optional().nullable(),
  seo_meta_description: z.string().trim().max(160).optional().nullable(),
  seo_keywords: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
