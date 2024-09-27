import Link from 'next/link'
import styles from './BlogPost.module.css'

interface Post {
  slug: string
  title: string
  excerpt: string
}

export default function RecommendedPosts({ currentSlug, allPosts }: { currentSlug: string, allPosts: Post[] }) {
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  const shuffled = otherPosts.sort(() => 0.5 - Math.random())
  const recommended = shuffled.slice(0, 6)

  return (
    <section className={styles.recommendedPosts}>
      <h2>Recommended Posts</h2>
      <div className={styles.recommendedGrid}>
        {recommended.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.recommendedPost}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}