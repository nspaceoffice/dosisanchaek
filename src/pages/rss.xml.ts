import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts } from '../lib/sanity';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: '도시산책',
    description: '도시의 풍경과 일상을 담는 미디어 블로그',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishedAt),
      description: post.excerpt || '',
      link: `/posts/${post.slug.current}/`,
    })),
    customData: `<language>ko</language>`,
  });
}
