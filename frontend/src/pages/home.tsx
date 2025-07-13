import { ObjectDto } from "@bonusx/cloud-storage-dashboard-api-client";
import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FileUploader from "../components/file-uploader";
import { Header } from "../components/header";
import { useFileUpload } from "../contexts/file-upload.context";
import { apiService } from "../services/api.service";
import { downloadFile } from "../utils/download-file";

export const Home = () => {
  const { files } = useFileUpload();
  const [retrievedFiles, setRetrievedFiles] = useState<ObjectDto[]>([]);

  useEffect(() => {
    console.log(files);
  });

  const [uploadedFile, setUploadedFile] = useState<ObjectDto | null>(null);

  // Modal
  const [open, setOpen] = useState(false);
  const toggleModal = () => setOpen(!open);

  const onUploadClick = async () => {
    const uploadedFile = await apiService.s3.uploadFile({
      file: files[0],
    });
    setUploadedFile(uploadedFile);
    toggleModal();
  };

  const updateFilesList = async () => {
    apiService.s3.getObjects().then((files) => setRetrievedFiles(files.items));
  };

  useEffect(() => {
    updateFilesList();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Header />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                  Benvenuto nell'applicazione
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Questa è l'impostazione iniziale per l'app con Material-UI
                  configurato correttamente.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={12}>
              <FileUploader />

              <Button variant="outlined" onClick={onUploadClick}>
                Upload
              </Button>
            </Grid>

            <Grid size={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Files on server:
                </Typography>
                <ul>
                  {retrievedFiles.map((file, idx) => (
                    <li key={idx}>{file.key}</li>
                  ))}
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Modal
        open={open}
        onClose={() => {
          updateFilesList();
          toggleModal();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            width: 400,
          }}
        >
          {uploadedFile ? (
            <>
              <Typography variant="body1" gutterBottom>
                File uploaded successfully:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Name:</strong> {uploadedFile.key}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Size:</strong> {uploadedFile.size ?? 0} bytes
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => downloadFile(uploadedFile.url)}
                sx={{ mt: 2 }}
              >
                Download File
              </Button>
            </>
          ) : (
            <Typography variant="body2">No file uploaded</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};
