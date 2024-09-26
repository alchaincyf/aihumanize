import { getAllPosts } from '@/lib/api'
import { Typography, Box, Grid } from '@mui/material'
import BlogPostCard from '@/app/components/BlogPostCard'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', px: 3 }}>
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          fontFamily: 'var(--font-sf-pro-display, sans-serif)',
          fontWeight: 700,
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          letterSpacing: '-0.02em',
          mb: 6,
          mt: 8,
          textAlign: 'center'
        }}
      >
        Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={post.slug}>
            <BlogPostCard post={post} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}