'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Divider, Button } from '@mui/material';
import Draggable from 'react-draggable';

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

export default function TranscriptPage({ params }: { params: { pk: string } }) {
  const router = useRouter();
  const strip_pk = params.pk;
  const pk = `TRANSCRIPT#${strip_pk}`;

  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoad, setDataLoad] = useState(false);
  const [summaryAI, setSummaryAI] = useState<string | null>(null);

  const [resetComments, setResetComments] = useState(false);

  useEffect(() => {
    const fetchTranscriptAndComments = async () => {
      if (pk) {
        try {
          const transcriptResponse = await fetch(`/transcripts/transcript/${strip_pk}/api/transcript/${strip_pk}`, {
            method: 'GET',
          });
          const transcriptData = await transcriptResponse.json();
          const tempComments: Comment[] = [];

          transcriptData.transcript.Items.forEach((item: any) => {
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
              tempComments.push({
                content: item.Comment.M.content.S,
                position: {
                  top: parseFloat(item.Comment.M.position.M.top.N),
                  left: parseFloat(item.Comment.M.position.M.left.N),
                },
              });
            }
          });

          setComments(tempComments);
          setDataLoad(true);
        } catch (error) {
          console.error('Error fetching transcript and comments:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTranscriptAndComments();
  }, [pk]);

  useEffect(() => {
    if (resetComments) {
      // Reset comments to original positions
      setResetComments(false);
      setComments((prevComments) => prevComments.map((comment) => ({
        ...comment,
        position: { ...comment.position }, // This forces the Draggable component to update its position
      })));
    }
  }, [resetComments]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/transcripts/transcript/${strip_pk}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript: transcript!.Content, comments: comments }),
        });
        if (response.ok) {
          const data = await response.json();
          setSummaryAI(data.response.choices[0].message.content);
        } else {
          console.error('Failed to fetch summary');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    if (comments.length > 0) {
      fetchSummary();
    }
  }, [dataLoad]);

  const handleResetComments = () => {
    setResetComments(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4, position: 'relative' }}>
      {transcript ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
            {transcript.Title}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
              {transcript.Content}
            </Typography>
            {comments.map((comment, index) => (
              <Draggable key={index} position={{ x: comment.position.left, y: comment.position.top - 670 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    padding: 1,
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="body2">{comment.content}</Typography>
                </Box>
              </Draggable>
            ))}
          </Box>

          <Divider sx={{ marginY: 4 }} />

          {summaryAI && (
            <Box sx={{ marginTop: 4, padding: 2, borderRadius: 2, boxShadow: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                AI Summary
              </Typography>
              <Typography variant="body1">{summaryAI}</Typography>
            </Box>
          )}
        </>
      ) : (
        <Typography>No transcript found.</Typography>
      )}
    </Box>
  );
}
