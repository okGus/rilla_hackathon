"use client";
import { Box, Button, TextField } from "@mui/material";
import { useState, useRef, useEffect } from 'react';
import { computePosition, autoPlacement } from '@floating-ui/react';

export default function Home() {
  const [text, setText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const referenceRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const inputTextField = useRef<HTMLTextAreaElement>(null);
  const [commentPublished, setCommentPublished] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  type Comment = {
    content: string;
    position: { top: number; left: number };
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
    const response = await fetch("/api/transcript", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (response.ok) {
      setText("");
      const data = await response.json();
      setResponseText(data);
      setCommentPublished(true); // Mark the comment as published
    } else {
      alert("Failed to submit transcript");
    }
  };

  const handleSubmitComment = () => {
    console.log("Comment submitted");
    setComments([...comments, { content: commentText, position }]);
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

  return (
    <Box
      flexDirection={"column"}
      sx={{
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
        py: 4,
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit transcript</Button>
      <Box sx={{ mt: 2 }} ref={referenceRef}>
        {responseText && <Box>{responseText}</Box>}
        <Button variant="contained" color="primary" onClick={() => setResponseText("")}>Clear</Button>
      </Box>

      {visible && (
        <div
          ref={floatingRef}
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            background: 'lightgray',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
        </div>
      )}

      {comments.map((comment, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: comment.position.top,
            left: comment.position.left,
            background: 'lightgray',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p>{comment.content}</p>
        </div>
      ))}
    </Box>
  );
}
