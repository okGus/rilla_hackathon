'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';

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

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (user) {
        try {
          const response = await fetch(`/transcripts/api/user-transcripts/${user.id}`, {
            method: 'GET',
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data.transcript[0].title);

            // Extract actual values from DynamoDB format
            const extractedTranscripts = data.transcript.map((item: any) => ({
              PK: item.PK.S,
              SK: item.SK.S,
              Title: item.title.S,
              Content: item.Content.S,
              UserId: item.UserId.S,
              CreatedAt: item.CreatedAt.S,
            }));

            console.log(extractedTranscripts[0].Title)

            // Filter transcripts to only include those with a title
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

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Transcripts
      </Typography>
      {transcripts.length === 0 ? (
        <Typography>No transcripts available with a title.</Typography>
      ) : (
        transcripts.map((transcript, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
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
