import { getAllPosts } from '@/lib/api'
import { Typography, Container, Box } from '@mui/material'
import BlogPostCard from '@/app/components/BlogPostCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的博客 | 精彩文章集锦',
  description: '探索各种有趣的主题和见解',
}

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <Box sx={{ 
      backgroundColor: '#F5F5F7', 
      minHeight: '100vh',
      py: { xs: 4, md: 8 }
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            fontFamily: 'var(--font-sf-pro-display, sans-serif)',
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            mb: { xs: 4, md: 6 },
            color: '#1D1D1F',
            textAlign: 'center'
          }}
        >
          Blog
        </Typography>
        <Box sx={{ 
          columnCount: { xs: 1, sm: 2, md: 3 },
          columnGap: '24px',
        }}>
          {posts.map((post, index) => (
            <Box key={post.slug} sx={{ breakInside: 'avoid', marginBottom: '24px' }}>
              <BlogPostCard post={post} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}