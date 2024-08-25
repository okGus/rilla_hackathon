"use client";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";
import { useState, useRef, useEffect } from 'react';
import { computePosition, autoPlacement } from '@floating-ui/react';
import { useUser } from '@clerk/nextjs';
import Draggable from 'react-draggable';
import { useRouter } from "next/navigation";

export default function TranscriptManagementPage() {
  const [text, setText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const referenceRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const inputTextField = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // File input ref
  const [commentCount, setCommentCount] = useState(0);
  const [transcriptID, setTranscriptID] = useState(""); // Replace with actual transcript ID

  const [summaryAI, setSummaryAI] = useState("");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File | null>(null);

  const [handleSave, setHandleSave] = useState(false);
  const [textTitle, setTextTitle] = useState("");

  const { user } = useUser()

  const router = useRouter();

  type Comment = {
    transcriptId: string;
    content: string;
    position: { top: number; left: number };
    file?: File | null; // Optional file might be attached
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Update the position for the floating UI
      setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      setVisible(true);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/create-transcript/api/transcripts/${transcriptID}`); // Replace with actual endpoint
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments);
          setAttachedFiles(null); // Reset after fetching
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // Fetch comments if a comment has been published
    if (commentCount > 0)
      fetchComments();
  }, [commentCount, transcriptID]);

  useEffect (() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/create-transcript/api/transcripts/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript: responseText, comments: comments }),
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
  }, [comments]);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (visible && floatingRef.current && inputTextField.current && referenceRef.current) {
      computePosition(referenceRef.current, floatingRef.current, {
        middleware: [autoPlacement()],
      })
      inputTextField.current.focus();
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (text.trim() === "") {
      return;
    }
    const response = await fetch("/create-transcript/api/transcripts/save-transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript: text, userId: user?.id }),
    });
    if (response.ok) {
      setText("");
      const data = await response.json();
      setResponseText(data.transcript);
      setTranscriptID(data.id);
    } else {
      alert("Failed to submit transcript");
    }
  };

  const handleSubmitComment = async () => {
    if (commentText.trim() === "") {
      return;
    }

    const newComment: Comment = {
      transcriptId: transcriptID,
      content: commentText,
      position: { top: position.top, left: position.left }
    };
  
    const response = await fetch("/create-transcript/api/transcripts/save-comments", {  // Replace with your actual API endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ comment: newComment, userId: user?.id }),
    });
  
    if (response.ok) {
      const data = await response.json();
      setCommentText("");
      setVisible(false);
      setCommentCount(prevCount => prevCount + 1);
    } else {
      console.log("Failed to submit comment");
    }
  };

  const handleDeleteComment = async (index: number) => {
    const comment = comments[index];
    const response = await fetch("/create-transcript/api/transcripts/delete-comment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentPK: comment.PK, commentSK: comment.SK, userId: user?.id }),
    });
    if (response.ok) {
      setComments((prevComments) => prevComments.filter((_, i) => i !== index));
      setCommentCount(prevCount => prevCount + 1);
    } else {
      console.error("Failed to delete comment");
    }
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior if needed
      handleSubmitComment(); // Handle submission when Enter is pressed
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setVisible(false); // Hide comment box on Escape
    }
  };

  const handleSubmitCommentFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    // If file is attached
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Upload to S3
        const uploadResponse = await fetch('/create-transcript/api/upload-to-s3', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.log('Failed to uploaod file to S3');
          return;
        }

        const uploadData = await uploadResponse.json();
        const s3Url = uploadData.fileURL; // API will return S3 URL

        const newComment = {
          transcriptId: transcriptID,
          content: commentText || 'File Attached',
          position: { top: position.top, left: position.left },
          fileUrl: s3Url,
        };

        const response = await fetch('/create-transcript/api/transcripts/save-comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: newComment }),
        });

        if (response.ok) {
          const data = await response.json();
          setCommentText("");
          setVisible(false);
          setCommentCount(prevCount => prevCount + 1);
        } else {
          console.log("Failed to submit comment");
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
      }
    }
  }

  const handleSaveTranscript = async () => {
    setHandleSave(true)
  }

  const confirmSaveTranscript = async () => {
    setHandleSave(false);
    try {
      const response = await fetch('/create-transcript/api/transcripts/save-title-transcript', { // Adjust path if necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcriptId: transcriptID,
          userId: user?.id,
          newTitle: textTitle,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Transcript updated:', data);
        // Handle success (e.g., show a notification, update UI)
      } else {
        console.error('Failed to update transcript');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setHandleSave(false);
    }

    router.push('/'); // Redirect to the homepage
  }

  return (
    <Box
      display={'flex'}
      flexDirection={"column"}
      sx={{
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        py: 4,
        px: 2,
      }}
    >
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        label="Enter text"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555",
            },
            "&:hover fieldset": {
              borderColor: "#777",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1DB954",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#888",
          },
          "& .MuiInputBase-input": {
            color: "white",
          },
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mb: 2 }}>Submit transcript</Button>
      <Box sx={{ mt: 2 }} ref={referenceRef}>
        {responseText && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">{responseText}</Typography>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={() => setResponseText("")}>Clear</Button>
      </Box>

      {visible && (
        <Box
          ref={floatingRef}
          sx={{
            position: 'absolute',
            top: position.top + 5,
            left: position.left,
            background: 'lightgray',
            padding: 2,
            borderRadius: 1,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <TextField
            inputRef={inputTextField}
            onKeyDown={handleEnter}
            multiline
            rows={4}
            placeholder="Add Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitComment}>Submit Comment</Button>
          <input 
            type='file'
            ref={fileInputRef}
            style={{ margin: '10px 0' }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitCommentFile}>Submit File</Button>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        {comments.map((comment, index) => (
          <Draggable key={index}>
          <Box
            // key={index}
            sx={{
              position: 'absolute',
              top: comment.Comment.position.top,
              left: comment.Comment.position.left,
              background: 'lightgray',
              padding: 2,
              borderRadius: 1,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              minWidth: '100px',
              maxWidth: '300px'
            }}
          >
            <Button
              onClick={() => handleDeleteComment(index)}
              sx={{
                position: 'absolute',
                top: 5,
                right: 5,
                minWidth: 'auto',
                padding: 0,
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: 'red',
              }}
            >
              X
            </Button>
            <Typography variant='body2'>{comment.Comment.content}</Typography>
            {comment.Comment.fileUrl && (
              <a href={comment.Comment.fileUrl} target="_blank" rel='noopener noreferrer'>
                View File
              </a>
            )}
          </Box>
          </Draggable>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">AI Summary</Typography>
        <Typography variant="body1">{summaryAI}</Typography>
      </Box>

      <Button variant="contained" color="primary" onClick={handleSaveTranscript} sx={{ mt: 4 }}>Save</Button>

      {handleSave && (
        <Modal open={handleSave} onClose={() => setHandleSave(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Save Transcript
                </Typography>
                <TextField 
                  value={textTitle} 
                  onChange={(e) => setTextTitle(e.target.value)} 
                  label="Enter title" 
                  fullWidth 
                  multiline 
                  rows={4} 
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                </TextField>
                <Button variant="contained" color="primary" onClick={confirmSaveTranscript}>Save</Button>
            </Box>
        </Modal>
      )}
    </Box>
  );
}
