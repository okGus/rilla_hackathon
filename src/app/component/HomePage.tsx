import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { UserButton } from '@clerk/nextjs';


const HomePage: React.FC = () => {
  const router = useRouter();


  return (
    <Box>
      <Box
        display={'flex'}
        height={'70px'}
        justifyContent={'space-between'}
        padding={'20px'}
        sx={{ width: '100%' }}
      >   
        <Typography 
          variant={"h6"}
          color={'grey'}
        >
          Rilla
        </Typography>
        <UserButton 
          showName 
        />
      </Box>
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Rilla
        </Typography>
        <Button onClick={() => router.push('/create-transcript')} variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Create Transcript
        </Button>
      </div>
    </Box>
  );
};

export default HomePage;
