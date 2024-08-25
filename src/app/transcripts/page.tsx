'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation'; // Adjust based on your routing solution

// Define the expected structure of the data from DynamoDB
interface Transcript {
  PK: string; // Partition key from DynamoDB
  SK: string; // Sort key from
  Title: string; // Title field from DynamoDB
  Content: string; // Content field from DynamoDB
  UserId: string;
  CreatedAt: string;
}

export default function UserTranscripts() {
  const { user } = useUser();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // For navigation

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (user) {
        try {
          const response = await fetch(`/transcripts/api/user-transcripts/${user.id}`, {
            method: 'GET',
          });

          if (response.ok) {
            const data = await response.json();

            // Extract actual values from DynamoDB format
            const extractedTranscripts = data.transcript.map((item: any) => ({
              PK: item.PK.S,
              SK: item.SK.S,
              Title: item.title.S,
              Content: item.Content.S,
              UserId: item.UserId.S,
              CreatedAt: item.CreatedAt.S,
            }));


            setTranscripts(extractedTranscripts);
          } else {
            console.error('Failed to fetch transcripts');
          }
        } catch (error) {
          console.error('Error fetching transcripts:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTranscripts();
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  const handleCardClick = (pk: string) => {
    const cleanedPk = pk.replace('TRANSCRIPT#', '');
    router.push(`/transcripts/transcript/${cleanedPk}`); // Navigate to the transcript details page
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Transcripts
      </Typography>
      {transcripts.length === 0 ? (
        <Typography>No transcripts available with a title.</Typography>
      ) : (
        transcripts.map((transcript) => (
          <Card
            key={transcript.PK}
            sx={{ marginBottom: 2, cursor: 'pointer' }}
            onClick={() => handleCardClick(transcript.PK)}
          >
            <CardContent>
              <Typography variant="h6">{transcript.Title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {transcript.Content}...
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
