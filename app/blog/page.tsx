import { getAllPosts } from '@/lib/api'
import Link from 'next/link'
import { Typography, Box, List, ListItem, Paper } from '@mui/material'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'var(--font-playfair-display)', mb: 4 }}>
        Blog Posts
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {posts.map((post) => (
          <ListItem key={post.slug} disablePadding>
            <Paper elevation={2} sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
              <Link href={`/blog/${post.slug}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'var(--font-montserrat)' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {post.date}
                  </Typography>
                  {post.excerpt && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {post.excerpt}
                    </Typography>
                  )}
                </Box>
              </Link>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}