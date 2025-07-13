import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onSubmit(fileName);
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Choose a file name</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <TextField
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          label="File name"
          variant="standard"
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleConfirm}
          loading={loading}
          disabled={loading || fileName.length === 0}
          variant="contained"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
