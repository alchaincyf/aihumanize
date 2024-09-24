// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid, Chip, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Layout from '../components/Layout';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface PricingTier {
  title: string;
  price: string;
  paymentLink: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    title: "Free",
    price: "$0 / mo.",
    paymentLink: "",
    features: [
      "5 humanizations per day",
      "Basic humanization styles",
      "No advanced features",
      "Community support"
    ],
    buttonText: "Get Started"
  },
  {
    title: "Pro",
    price: "$9.99 / mo.",
    paymentLink: "https://buy.stripe.com/7sIeXtbHfdTBgqAfYY",
    features: [
      "50 humanizations per day",
      "All humanization styles",
      "Priority processing",
      "Basic API access",
      "Email support"
    ],
    buttonText: "Choose Pro",
    isPopular: true
  },
  {
    title: "Pro Max",
    price: "$29.99 / mo.",
    paymentLink: "https://buy.stripe.com/fZebLhh1zeXFgqA7st",
    features: [
      "Unlimited humanizations",
      "All current and future features",
      "Highest priority processing",
      "Full API access",
      "Dedicated support"
    ],
    buttonText: "Choose Pro Max"
  }
];

const PricingCard: React.FC<PricingTier> = ({ title, price, paymentLink, features, buttonText, isPopular }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribe = () => {
    if (paymentLink) {
      if (isAuthenticated) {
        // 使用 URL 对象来正确地添加查询参数
        const url = new URL(paymentLink);
        url.searchParams.append('client_reference_id', auth.currentUser?.uid || '');
        window.location.href = url.toString();
      } else {
        router.push('/login?redirect=pricing');
      }
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isPopular && (
        <Chip
          label="Most Popular"
          color="primary"
          sx={{ position: 'absolute', top: 16, right: 16 }}
        />
      )}
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="p" gutterBottom>
        {price}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CheckIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">{feature}</Typography>
          </Box>
        ))}
      </Box>
      <Button
        variant={isPopular ? "contained" : "outlined"}
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubscribe}
        disabled={!paymentLink}
      >
        {buttonText}
      </Button>
    </Paper>
  );
};

export default function PricingPage() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Select the perfect plan for your needs and start humanizing your AI-generated content today.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {pricingTiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <PricingCard {...tier} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}