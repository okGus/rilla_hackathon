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
    AppBar,
    Toolbar,
} from '@mui/material';
import { Comment, Edit, Delete, AttachFile, PlayArrow, CheckCircleOutline } from '@mui/icons-material';
import Link from 'next/link';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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

export default function LandingPage(){
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
                                    Empower your team with AI-driven transcript management
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
                                    Get Started Free
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
                                <Box
                                    component="img"
                                    src="/dashboard-mockup.png"
                                    alt="Dashboard Mockup"
                                    sx={{
                                    width: '100%',
                                    height: 'auto',
                                    position: 'relative',
                                    zIndex: 1,
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    }}
                                />
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
                        { icon: <Comment />, title: "Smart Annotations", text: "AI-powered comment suggestions" },
                        { icon: <Edit />, title: "Real-time Editing", text: "Collaborate with your team in real-time" },
                        { icon: <Delete />, title: "Version Control", text: "Track changes and revert when needed" },
                        { icon: <AttachFile />, title: "Rich Attachments", text: "Add context with multi-media files" },
                    ].map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
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
                            See It in Action
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4 }}>
                                Watch how our intuitive interface revolutionizes transcript management. From quick annotations to in-depth analysis, weve got you covered.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<PlayArrow />}
                                size="large"
                                sx={{ 
                                    borderColor: '#1a237e',
                                    color: '#1a237e',
                                    '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.04)' },
                                }}
                            >
                                Watch Demo
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingTop: '56.25%', // 16:9 aspect ratio
                                    bgcolor: '#f0f0f0',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/video-placeholder.jpg"
                                    alt="Product demo video"
                                    sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    }}
                                />
                                <Box
                                    sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    borderRadius: '50%',
                                    p: 2,
                                    cursor: 'pointer',
                                    }}
                                >
                                    <PlayArrow sx={{ fontSize: 60, color: '#1a237e' }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Testimonial Section */}
            <Box sx={{ bgcolor: '#f5f5f7', py: 10 }}>
                <Container maxWidth="md">
                    <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 700 }}>
                        What Our Customers Say
                    </Typography>
                    <Card sx={{ bgcolor: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                                {/* Testimony here */}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box
                                    component="img"
                                    src="/avatar-placeholder.jpg"
                                    alt="Customer avatar"
                                    sx={{ width: 60, height: 60, borderRadius: '50%', mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {/* Sarah Johnson */}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {/* Sales Director, TechCorp Inc. */}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    bgcolor: '#1a237e',
                    color: 'white',
                    py: 10,
                    clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)',
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                        Ready to Elevate Your Sales Process?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, fontWeight: 300 }}>
                        Join thousands of sales professionals already using our platform
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