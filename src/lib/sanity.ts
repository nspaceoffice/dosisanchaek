import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Types
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: SanityImageSource;
  body: any[];
  publishedAt: string;
  category: Category;
  author: Author;
  tags: string[];
  videoUrl?: string;
  gallery?: SanityImageSource[];
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Author {
  _id: string;
  name: string;
  image?: SanityImageSource;
  bio?: string;
}

// Queries
export async function getAllPosts(): Promise<Post[]> {
  return await sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      tags,
      videoUrl,
      "category": category->{_id, title, slug},
      "author": author->{_id, name, image}
    }
  `);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await sanityClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      publishedAt,
      tags,
      videoUrl,
      gallery,
      "category": category->{_id, title, slug},
      "author": author->{_id, name, image, bio}
    }
  `, { slug });
  return posts;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return await sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...4] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      "category": category->{_id, title, slug}
    }
  `);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return await sanityClient.fetch(`
    *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      tags,
      "category": category->{_id, title, slug}
    }
  `, { categorySlug });
}

export async function getAllCategories(): Promise<Category[]> {
  return await sanityClient.fetch(`
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }
  `);
}
