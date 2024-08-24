import React from 'react';
import { Button, Typography } from '@mui/material';
import { useRouter } from "next/navigation";


const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Rilla
      </Typography>
      <Button onClick={() => router.push('/create-transcript')} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Create Transcript
      </Button>
    </div>
  );
};

export default HomePage;
