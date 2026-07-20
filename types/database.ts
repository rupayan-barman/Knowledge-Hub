export type ResourceStatus = 'draft' | 'published' | 'hidden' | 'archived';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type LearningType =
  | 'documentation'
  | 'video_course'
  | 'interactive'
  | 'book'
  | 'tool'
  | 'article'
  | 'community'
  | 'other';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  resource_count: number;
}

export interface Resource {
  id: string;
  slug: string;
  name: string;
  official_url: string;
  short_description: string;
  detailed_description: string | null;
  category_id: string | null;
  tags: string[];
  difficulty_level: DifficultyLevel | null;
  learning_type: LearningType | null;
  personal_review: string | null;
  advantages: string[];
  disadvantages: string[];
  useful_for: string | null;
  status: ResourceStatus;
  is_featured: boolean;
  is_pinned: boolean;
  logo_url: string | null;
  screenshot_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceWithCategory extends Resource {
  category: Category | null;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail_url: string | null;
  technologies: string[];
  status: ProjectStatus;
  github_url: string | null;
  live_url: string | null;
  gallery: string[];
  future_improvements: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>; // Tiptap JSON document
  content_text: string; // plain-text extraction for search
  category_id: string | null;
  tags: string[];
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  usage_type: 'logo' | 'screenshot' | 'category_cover' | 'project_image' | 'general';
  linked_table: string | null;
  linked_id: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  project_name: string;
  tagline: string | null;
  homepage_text: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  homepage_banner_url: string | null;
  footer_text: string;
  theme_default: 'dark' | 'light' | 'system';
  accent_color: string;
  social_links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  seo_keywords: string[];
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_resources: number;
  total_categories: number;
  total_projects: number;
  total_notes: number;
  pinned_resources: number;
  draft_resources: number;
  published_resources: number;
}

export interface Database {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      resources: { Row: Resource; Insert: Partial<Resource>; Update: Partial<Resource> };
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> };
      notes: { Row: Note; Insert: Partial<Note>; Update: Partial<Note> };
      media_assets: { Row: MediaAsset; Insert: Partial<MediaAsset>; Update: Partial<MediaAsset> };
      settings: { Row: Settings; Insert: Partial<Settings>; Update: Partial<Settings> };
      activity_log: { Row: ActivityLogEntry; Insert: Partial<ActivityLogEntry>; Update: Partial<ActivityLogEntry> };
    };
  };
}
