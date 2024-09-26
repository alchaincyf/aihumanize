'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Typography, Card, CardContent, CardActionArea } from '@mui/material'

interface BlogPostCardProps {
  post: {
    slug: string
    title: string
    date: string
    excerpt?: string
  }
  index: number
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'transparent',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <CardActionArea component={Link} href={`/blog/${post.slug}`}>
        <CardContent>
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div"
            sx={{ 
              fontFamily: 'var(--font-sf-pro-display, sans-serif)',
              fontWeight: 600,
              fontSize: '1.5rem',
              color: '#1D1D1F',
              mb: 2
            }}
          >
            {post.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontFamily: 'var(--font-sf-pro-text, sans-serif)',
              mb: 2
            }}
          >
            {post.date === 'No date' ? 'No date' : new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          {post.excerpt && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.5,
                height: '6em'
              }}
            >
              {post.excerpt}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}