import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }) {
  const defaultImage = '/images/default-blog-image.jpg';
  const imageSrc = post.coverImage && post.coverImage.startsWith('/') 
    ? post.coverImage 
    : defaultImage;

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt={post.title || "Blog post"}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
}