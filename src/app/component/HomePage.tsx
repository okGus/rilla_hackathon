import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { UserButton } from '@clerk/nextjs';
import { styled } from '@mui/system';


const HomePage: React.FC = () => {
  const router = useRouter();

  const buttonStyle = {
    backgroundColor: '#FF8E53',
    color: 'white',
    padding: '12px 32px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    margin: '10px',
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#FE6B8B';
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#FF8E53';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const GradientText = styled(Typography)`
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  `;


  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
        color: 'white',
        pt: { xs: 5, md: 10 },
        pb: { xs: 5, md: 20 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="20px"
        sx={{
          height: { xs: '60px', md: '80px' },
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          margin: '10px 20px',
        }}
      >
        <Typography
          variant="h5"
          color="white"
          sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Rilla
        </Typography>
        <UserButton
          showName
          sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '0.875rem', md: '1rem' } }}
        />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}
      >
        <GradientText variant="h3"  gutterBottom>
          Rilla
        </GradientText>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            onClick={() => router.push('/create-transcript')}
            variant="contained"
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Create Transcript
          </Button>
          <Button
            onClick={() => router.push('/transcripts')}
            variant="contained"
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            See Transcripts
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
