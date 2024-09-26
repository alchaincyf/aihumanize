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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`} passHref style={{ textDecoration: 'none' }}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 2,
            transition: 'all 0.3s',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardActionArea>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  mb: 1
                }}
              >
                {post.title}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                  fontSize: '0.875rem',
                  mb: 2,
                  display: 'block'
                }}
              >
                {post.date}
              </Typography>
              {post.excerpt && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'var(--font-sf-pro-text, sans-serif)',
                    fontSize: '0.9rem',
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  {post.excerpt}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </motion.div>
  )
}