import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

type UploadFormModalProps = {
  file: File;
  open: boolean;
  onSubmit: (fileName: string) => void;
  onCancel: () => void;
};

export const UploadFormModal = ({
  file,
  open,
  onSubmit,
  onCancel,
}: UploadFormModalProps) => {
  const [fileName, setFileName] = useState(file?.name ?? "");

  const handleConfirm = () => {
    onSubmit(fileName);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Upload File</DialogTitle>

      <Box sx={{ p: 2 }}>
        <TextField
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          label="File name"
          variant="standard"
        />
      </Box>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          disabled={fileName.length === 0}
          variant="contained"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
