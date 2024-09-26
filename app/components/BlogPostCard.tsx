'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Typography, Card, CardContent, CardActionArea, Box } from '@mui/material'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        elevation={0}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <CardActionArea component={Link} href={`/blog/${post.slug}`}>
          <CardContent>
            <Typography 
              variant="caption" 
              sx={{ 
                fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                color: 'primary.main',
                backgroundColor: 'rgba(0, 113, 227, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                mb: 2,
                display: 'inline-block',
              }}
            >
              {post.date === 'No date' ? 'No date' : new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Typography>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontFamily: 'var(--font-sf-pro-display, sans-serif)',
                fontWeight: 600,
                fontSize: '1.25rem',
                color: '#1D1D1F',
                mb: 2,
              }}
            >
              {post.title}
            </Typography>
            {post.excerpt && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                  display: '-webkit-box',
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.6,
                  mb: 2,
                  fontSize: '0.875rem',
                }}
              >
                {post.excerpt}
              </Typography>
            )}
            <Typography 
              variant="button" 
              sx={{ 
                fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                color: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Read More
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  )
}