'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';

// Define the expected structure of the data from DynamoDB
interface Transcript {
  PK: string;
  SK: string;
  Title: string;
  Content: string;
  UserId: string;
  CreatedAt: string;
}

interface Comment {
  content: string;
  position: { top: number; left: number };
}

export default function TranscriptPage({params}: {params: {pk: string} } ) {
  const router = useRouter();

  const strip_pk = params.pk
  const pk = `TRANSCRIPT#${strip_pk}`


  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscriptAndComments = async () => {
      if (pk) {
        try {
          // Fetch transcript details
          const transcriptResponse = await fetch(`/transcripts/transcript/${strip_pk}/api/transcript/${strip_pk}`,{
            method: 'GET',
          });
          const transcriptData = await transcriptResponse.json();


          transcriptData.transcript.Items.forEach((item: any) => {
            // Check if the item is a transcript
            if (item.Content) {
              setTranscript({
                PK: item.PK.S,
                SK: item.SK.S,
                Title: item.title.S,
                Content: item.Content.S,
                UserId: item.UserId.S,
                CreatedAt: item.CreatedAt.S,
              });
            } else {
              // Otherwise, assume it's a comment
              comments.push({
                content: item.Comment.M.content.S,
                position: {
                  top: item.Comment.M.position.M.top, // Convert from string to number
                  left: item.Comment.M.position.M.left, // Convert from string to number
                },
              });
            }
          });
        } catch (error) {
          console.error('Error fetching transcript and comments:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTranscriptAndComments();
  }, [pk]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {transcript ? (
        <>
          <Typography variant="h4" gutterBottom>
            {transcript.Title}
          </Typography>
          <Typography variant="body1" paragraph>
            {transcript.Content}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography>No comments available.</Typography>
          ) : (
            comments.map((comment, index) => (
              <Card key={index} sx={{ marginBottom: 2, position: 'relative' }}>
                <CardContent>
                  <Typography variant="body2">{comment.content}</Typography>
                  {/* Map comment position here */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: comment.position.top,
                      left: comment.position.left,
                      width: 8,
                      height: 8,
                      backgroundColor: 'red',
                      borderRadius: '50%',
                    }}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </>
      ) : (
        <Typography>No transcript found.</Typography>
      )}
    </Box>
  );
}
