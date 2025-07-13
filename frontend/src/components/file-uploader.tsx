import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";

type FileUploaderProps = {
  accept?: string;
  onFileSelect: (file: File) => void;
};

const FileUploader = ({ accept = "", onFileSelect }: FileUploaderProps) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const newFiles = Array.from(event.dataTransfer.files);

    onFileSelect(newFiles[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    onFileSelect(newFiles[0]);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      sx={{
        p: 4,
        border: "2px dashed",
        borderRadius: "4px",
        textAlign: "center",
        borderColor: dragging ? "primary.main" : "grey.400",
        backgroundColor: dragging ? "grey.100" : "transparent",
        transition: "border-color 0.2s, background-color 0.2s",
        cursor: "pointer",
      }}
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <CloudUploadIcon fontSize="large" color="action" />
      <Typography variant="h6" mt={2}>
        Drag & Drop a file here
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        or click below to select a file
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        hidden
      />
      <label htmlFor="single-file-input">
        <Button variant="contained" component="span">
          Browse
        </Button>
      </label>
    </Box>
  );
};

export default FileUploader;
