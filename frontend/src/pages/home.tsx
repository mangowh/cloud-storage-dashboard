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
import { Header } from "../components/header";
import FileUploader from "../components/file-uploader";
import {
  FileUploadProvider,
  useFileUpload,
} from "../contexts/file-upload.context";
import {
  Configuration,
  ObjectDto,
  S3Api,
} from "@bonusx/cloud-storage-dashboard-api-client";

const s3ApiClient = new S3Api(
  new Configuration({
    basePath: "http://localhost:3000",
  }),
);

export const Home = () => {
  const fileUpload = useFileUpload();
  const [files, setFiles] = useState<ObjectDto[]>([]);

  useEffect(() => {
    updateFilesList();
  }, []);

  const [uploadedFile, setUploadedFile] = useState<ObjectDto | null>(null);

  // Modal
  const [open, setOpen] = useState(false);
  const toggleModal = () => setOpen(!open);

  const onUploadClick = async () => {
    const uploadedFile = await s3ApiClient.uploadFile({
      file: fileUpload.files[0],
    });
    setUploadedFile(uploadedFile);
    toggleModal();
  };

  const updateFilesList = async () => {
    s3ApiClient.getObjects().then((files) => setFiles(files.items));
  };

  return (
    <>
      <FileUploadProvider>
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
                    {files.map((file, idx) => (
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
        >
          <Box
            sx={{
              bgcolor: "white",
              p: 4,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              textWrap: "break-word",
              wordBreak: "break-all",
            }}
          >
            {JSON.stringify(uploadedFile)}
          </Box>
        </Modal>
      </FileUploadProvider>
    </>
  );
};
