import { getPostBySlug } from '@/lib/api'
import { Typography, Box, Paper } from '@mui/material'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return <Typography>Post not found</Typography>
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'var(--font-playfair-display)' }}>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {post.date}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <MDXRemote source={post.content} />
        </Box>
      </Paper>
    </Box>
  )
}