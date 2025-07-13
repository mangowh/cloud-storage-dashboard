import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Paper, Typography } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import { useFileUpload } from "../contexts/file-upload.context";

type FileUploaderProps = {
  accept?: string;
  multiple?: boolean;
};

const FileUploader = ({ accept = "", multiple = false }: FileUploaderProps) => {
  const { files, addFiles } = useFileUpload();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box width="100%">
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        hidden
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />

      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          p: 4,
          borderStyle: "dashed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          cursor: "pointer",
          borderColor: "grey.400",
          "&:hover": {
            borderColor: "primary.main",
          },
        }}
        onClick={handleClick}
      >
        {files.length > 0 ? (
          files.map((file) => (
            <Typography key={file.name} variant="body2">
              {file.name}
            </Typography>
          ))
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: "grey.400" }} />
            <Box display="flex" alignItems="center" mt={2}>
              <Button variant="text" onClick={handleClick}>
                Upload a file
              </Button>
              <Typography variant="body2" sx={{ pl: 1 }}>
                or drag and drop
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" mt={1}>
              Any file up to 10MB
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default FileUploader;
