import BlogList from './BlogList';
import { getPaginatedPosts } from '@/lib/api';

export const metadata = {
  title: 'Blog | Humanize AI',
  description: 'Explore our latest articles on AI and technology.',
};

export default async function Blog() {
  const initialPosts = await getPaginatedPosts(1, 12);
  
  return <BlogList initialPosts={initialPosts} />;
}