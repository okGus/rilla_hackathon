'use client';

import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    styled,
    keyframes,
    useTheme,
} from '@mui/material';
import { Comment, Edit, AttachFile, CheckCircleOutline } from '@mui/icons-material';
import Link from 'next/link';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
`;

const GradientText = styled(Typography)`
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const FeatureCard = styled(Card)`
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
    }
`;

const AnimatedBox = styled(Box)`
    animation: ${fadeIn} 1s ease-out;
`;

const SlideInBox = styled(Box)`
    animation: ${slideIn} 1s ease-out;
`;

export default function LandingPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: '#f5f5f7' }}>
        {/* Hero Section */}
        <Box
            sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                color: 'white',
                pt: { xs: 10, md: 20 },
                pb: { xs: 10, md: 20 },
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <AnimatedBox>
                            <GradientText variant="h1" sx={{ fontWeight: 800, mb: 2 }}>
                                Transform Your Sales Process
                            </GradientText>
                            <Typography variant="h5" sx={{ mb: 4, fontWeight: 300 }}>
                                Rilla empowers your team with advanced AI-driven transcript management tools, enabling seamless communication and streamlined processes.
                            </Typography>
                            <Button
                                component={Link}
                                href='/sign-in'
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: '#FF8E53',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#FE6B8B' },
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.1rem',
                                }}
                            >
                                Get Started for Free
                            </Button>
                        </AnimatedBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '10%',
                                    left: '10%',
                                    right: '10%',
                                    bottom: '10%',
                                    background: 'rgba(255,255,255,0.1)',
                                    filter: 'blur(25px)',
                                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                }
                            }}
                        >
                            {/* Add an image or graphic here */}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ my: 10 }}>
            <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 700 }}>
                Powerful Features
            </Typography>
            <Grid container spacing={4}>
                {[
                    { icon: <Comment />, title: "Smart Annotations", text: "Rilla's AI-powered comment summarization helps you quickly grasp key insights and trends from your sales transcripts, improving clarity and decision-making." },
                    { icon: <Edit />, title: "Real-time Editing", text: "Seamlessly add, delete, and edit comments on transcripts in real time, ensuring your feedback is always up-to-date and relevant." },
                    { icon: <AttachFile />, title: "Rich Attachments", text: "Easily upload and manage your sales transcripts, including multimedia files, to keep all relevant information in one place." },
                ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <SlideInBox>
                        <FeatureCard elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Box sx={{ mb: 2, color: '#1a237e' }}>{React.cloneElement(feature.icon, { fontSize: 'large' })}</Box>
                            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {feature.text}
                            </Typography>
                        </CardContent>
                        </FeatureCard>
                    </SlideInBox>
                </Grid>
                ))}
            </Grid>
        </Container>

        {/* Demo Section */}
        <Box sx={{ bgcolor: 'white', py: 10 }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                            See Rilla in Action
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            Discover how Rilla's intuitive interface transforms your approach to transcript management. From effortless annotations to comprehensive analysis, Rilla is your solution for enhancing communication and efficiency.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '100%',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '10%',
                                    left: '10%',
                                    right: '10%',
                                    bottom: '10%',
                                    background: 'rgba(255,255,255,0.1)',
                                    filter: 'blur(25px)',
                                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                },
                            }}
                        >
                            <iframe width="560" 
                            height="315" 
                            src="https://www.youtube.com/embed/p8Qwr5KKJ-Q?si=iQ8VBWpHpIVd4GmB" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            ></iframe>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>

        {/* CTA Section */}
        <Box
            sx={{
                bgcolor: '#1a237e',
                color: 'white',
                py: 10,
                clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                    Ready to Elevate Your Sales Process?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 300 }}>
                    Join thousands of sales professionals already using Rilla to streamline their transcript management and boost team productivity.
                </Typography>
                <Button
                    component={Link}
                    href='/sign-in'
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircleOutline />}
                    sx={{
                        bgcolor: '#FF8E53',
                        color: 'white',
                        '&:hover': { bgcolor: '#FE6B8B' },
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                    }}
                >
                    Start Your Free Trial
                </Button>
            </Container>
        </Box>
    </Box>
  );
};
