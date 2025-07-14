import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Typography } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/auth.context";
import { formatFileSize } from "../utils/format-file-size";

type FileUploaderProps = {
  accept?: string;
  maxFileSize?: number;
  onFileSelect: (file: File) => void;
};

const FileUploader = ({
  accept = "",
  maxFileSize = 10 * 1024 * 1024, // 10 MB
  onFileSelect,
}: FileUploaderProps) => {
  const notifications = useNotifications();
  const auth = useAuth();

  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const newFiles = Array.from(event.dataTransfer.files);
    const newFile = newFiles[0];

    if (newFile.size > maxFileSize) {
      return notifications.show(
        `File size exceeds the maximum limit of ${formatFileSize(maxFileSize)}`,
        { severity: "error", autoHideDuration: 5000 },
      );
    }

    onFileSelect(newFile);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const newFile = newFiles[0];

    if (newFile.size > maxFileSize) {
      return notifications.show(
        `File size exceeds the maximum limit of ${formatFileSize(maxFileSize)}`,
        { severity: "error", autoHideDuration: 5000 },
      );
    }

    onFileSelect(newFile);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    if (!auth.user) {
      notifications.show("You need to be logged in to upload a file", {
        severity: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    inputRef.current?.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
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
      <Box>
        <Typography variant="h6">Drag & Drop a file here</Typography>
        <Typography variant="body2" color="textSecondary">
          or click below to select a file
        </Typography>
      </Box>
      <Button variant="contained" component="span">
        Browse
      </Button>
      <Typography variant="caption" color="textSecondary">
        Max file size: {formatFileSize(maxFileSize, 0)}
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        hidden
      />
    </Box>
  );
};

export default FileUploader;
