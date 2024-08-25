import React, { useState, useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';




export default function Upload() {
  const fileInputRef = useRef(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('');

  const handleFile = (e: any) => {
    try{
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target.result);
        };
        reader.readAsText(file);
      }
    }catch(e){
      console.log(e);
    }
  };

  const onSubmit = () => {
    if (!fileContent) return; // Ensure fileContent is not null
    // Fetch transcripts from backend
    setLoading(true);
    fetch('Backend URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: fileContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error:', error); // Handle fetch error
      });
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
    // Example of handling text file selection from predefined options
    const exampleText = "Sample text content for example " + event.target.value;
    setFileContent(exampleText);
  };

  return (
    <>
      <header className="container header">
        <nav className="nav">
          

          <div className="nav_menu" id="nav_menu">
            <button className="close_btn" id="close_btn">
              <i className="ri-close-fill"></i>
            </button>
          </div>

          <button className="toggle_btn" id="toggle_btn">
            <i className="ri-menu-line"></i>
          </button>
        </nav>
      </header>

      <section className="wrapper">
        <div className="container">
          <div className="app_wrapper">
            <Stack direction="column" alignItems="center" spacing={2}>
              <Typography variant="h4">
                Upload a .txt file or choose one of our demo texts below!
              </Typography>
              <FormControl>
                <InputLabel id="select-label">Example</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={selected}
                  label="Example"
                  onChange={handleChange}
                  sx={{
                    width: '100px',
                  }}
                >
                  {[...Array(7).keys()].map((i) => (
                    <MenuItem value={`Example ${i + 1}`} key={i}>
                      Example {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <input
                type="file"
                accept=".txt"
                onChange={handleFile}
                multiple={false}
                ref={fileInputRef}
                hidden
              />
              <button
                className="btn upl_btn"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                style={{
                  backgroundColor: '#FF8E53',
                  color: 'white',
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FE6B8B'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF8E53'}
              >
                Upload <i className="ri-file-upload-line"></i>
              </button>

              {fileContent && (
                <Typography>
                  File Content Preview: {fileContent.substring(0, 100)}...
                </Typography>
              )}
              {fileContent && (
                <button className="btn upl_btn" onClick={onSubmit}
                  style={{
                    backgroundColor: '#FF8E53',
                    color: 'white',
                    padding: '12px 32px',
                    fontSize: '1.1rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FE6B8B'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF8E53'}
                >
                  Submit
                </button>
              )}
              {loading && <p>Loading...</p>}
            </Stack>
          </div>
        </div>
      </section>
      <Box height="10vh" />
    </>
  );
}