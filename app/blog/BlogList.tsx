//@ts-nocheck

'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import BlogCard from './BlogCard';

const BlogList = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMorePosts = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/posts?page=${nextPage}&limit=12`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const newPosts = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && !isLoading) {
      loadMorePosts();
    }
  }, [inView]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {isLoading && <div className="text-center mt-4">Loading more posts...</div>}
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default BlogList;