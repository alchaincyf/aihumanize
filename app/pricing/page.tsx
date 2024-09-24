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

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribe = (paymentLink: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const email = user.email;
    const linkWithClientReferenceId = `${paymentLink}?client_reference_id=${email}`;
    window.location.href = linkWithClientReferenceId;
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          {pricingTiers.map((tier) => (
            <Grid item xs={12} md={4} key={tier.title}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                  {tier.title}
                </Typography>
                <Typography variant="h6" align="center" gutterBottom>
                  {tier.price}
                </Typography>
                <ul>
                  {tier.features.map((feature, index) => (
                    <Typography component="li" key={index} align="center">
                      {feature}
                    </Typography>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleSubscribe(tier.paymentLink)}
                  sx={{ mt: 2 }}
                >
                  {tier.buttonText}
                </Button>
                {tier.isPopular && (
                  <Chip
                    label="Most Popular"
                    color="secondary"
                    icon={<CheckIcon />}
                    sx={{ mt: 2 }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}