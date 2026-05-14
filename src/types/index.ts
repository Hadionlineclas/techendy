export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: any;
  bio?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  status: 'draft' | 'published';
  featuredImage: string;
  createdAt: any;
  updatedAt: any;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  recommendedToolName?: string;
  recommendedToolUrl?: string;
  titleBgColor?: string;
  titleBgOpacity?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  createdAt: any;
}

export interface SiteAnalytics {
  id: string;
  date: string;
  views: number;
  sessions: number;
}
