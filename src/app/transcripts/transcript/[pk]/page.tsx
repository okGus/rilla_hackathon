'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';

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

  const [dataLoad, setDataLoad] = useState(false);

  const [summaryAI, setSummaryAI] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscriptAndComments = async () => {
      if (pk) {
        try {
          // Fetch transcript details
          const transcriptResponse = await fetch(`/transcripts/transcript/${strip_pk}/api/transcript/${strip_pk}`,{
            method: 'GET',
          });
          const transcriptData = await transcriptResponse.json();
          const tempComments: Comment[] = [];


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
              tempComments.push({
                content: item.Comment.M.content.S,
                position: {
                  top: parseFloat(item.Comment.M.position.M.top.N), // Convert from string to number
                  left: parseFloat(item.Comment.M.position.M.left.N), // Convert from string to number
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

  useEffect (() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/transcripts/transcript/${strip_pk}/api/generate', {
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

    // Fetch summary if comments have been added
    if (comments.length > 0) {
      fetchSummary();
    }
  }, [dataLoad]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {transcript ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
            {transcript.Title}
          </Typography>
          <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
            {transcript.Content}
          </Typography>

          <Divider sx={{ marginY: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
            Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography>No comments available.</Typography>
          ) : (
            comments.map((comment, index) => (
              <Card key={index} sx={{ marginBottom: 2, position: 'relative', padding: 2 }}>
                <CardContent>
                  <Typography variant="body2">{comment.content}</Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: comment.position.top,
                      left: comment.position.left,
                      width: 12,
                      height: 12,
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </CardContent>
              </Card>
            ))
          )}
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
