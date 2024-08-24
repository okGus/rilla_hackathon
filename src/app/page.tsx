"use client";
import {
  Box, Button, TextField
} from "@mui/material";
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState("");
  const [responseText, setResponseText] = useState("");

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
    } else {
      alert("Failed to submit transcript")
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
      <Box sx={{ mt: 2 }}>
        {responseText && <Box>{responseText}</Box>}
      </Box>
    </Box>
  )
}