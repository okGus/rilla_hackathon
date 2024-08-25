'use client';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, Divider, Button } from '@mui/material';
import Draggable from 'react-draggable';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  fileUrl?: string | null; // Optional file might be attached;
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
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const bigContainerRef = useRef<HTMLDivElement>(null);

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
                fileUrl: item.Comment.M.fileUrl ? item.Comment.M.fileUrl.S : null, // Check if fileUrl exists
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

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setContainerDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [transcript, comments]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (transcript && containerDimensions.height > 0) {
          const response = await fetch(`/transcripts/transcript/${strip_pk}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcript.Content, comments: comments }),
          });
          if (response.ok) {
            const data = await response.json();
            setSummaryAI(data.response.choices[0].message.content);
          } else {
            console.error('Failed to fetch summary');
          }
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    if (dataLoad) {
      fetchSummary();
    }
  }, [dataLoad, transcript, comments, containerDimensions.height]);

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

  const handleResetComments = () => {
    setResetComments(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4, position: 'relative' }} ref={bigContainerRef}>
      {transcript ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
            {transcript.Title}
          </Typography>
          <Box sx={{ position: 'relative' }} ref={containerRef}>
            <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
              {transcript.Content}
            </Typography>
            {comments.map((comment, index) => (
              <Draggable
                key={index}
                position={{
                  x: comment.position.left,
                  y: comment.position.top - containerDimensions.height - 260,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    padding: 3,
                    borderRadius: 1,
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="body2">{comment.content}</Typography>
                  {comment.fileUrl && (
                    <Typography variant='body2' color='primamry' sx={{ marginTop: 1}}>
                      <a href={comment.fileUrl} target='_blank' rel='noopener noreferrer'>
                        View Attached File
                      </a>
                    </Typography>
                  )}
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
              {/* <Typography variant="body1">{summaryAI}</Typography> */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {summaryAI}
              </ReactMarkdown>
            </Box>
          )}
        </>
      ) : (
        <Typography>No transcript found.</Typography>
      )}
    </Box>
  );
}
