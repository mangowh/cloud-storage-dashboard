import { ObjectDto } from "@bonusx/cloud-storage-dashboard-api-client";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import FileUploader from "../components/file-uploader";
import { Header } from "../components/header";
import { UploadFormModal } from "../components/upload-form-modal";
import { apiService } from "../services/api.service";
import { downloadFile } from "../utils/download-file";
import { formatFileSize } from "../utils/format-file-size";

export const Home = () => {
  const [file, setFile] = useState<File | null>();
  const [retrievedFiles, setRetrievedFiles] = useState<ObjectDto[]>([]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [uploadedFileInfoModalOpen, setUploadedFileInfoModalOpen] =
    useState(false);
  const [uploadedFile, setUploadedFile] = useState<ObjectDto | null>(null);

  useEffect(() => {
    updateFilesList();
  }, []);

  useEffect(() => {
    if (file) {
      setUploadModalOpen(true);
    }
  }, [file]);

  const updateFilesList = async () => {
    apiService.s3.getObjects().then((files) => setRetrievedFiles(files.items));
  };

  const onSubmit = async (newFileName: string) => {
    if (file) {
      const fileToUpload = new File([file], newFileName);

      try {
        const uploadedFile = await apiService.s3.uploadFile({
          file: fileToUpload,
        });

        updateFilesList();

        setUploadModalOpen(false);
        setFile(null);

        setUploadedFile(uploadedFile);
        setUploadedFileInfoModalOpen(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Header />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <FileUploader onFileSelect={setFile} />
            </Grid>

            <Grid size={12}>
              <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>File Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Size</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Last Modified</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Download</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {retrievedFiles.map((file) => (
                      <TableRow key={file.key}>
                        <TableCell>{file.key}</TableCell>
                        <TableCell>
                          {file.size ? formatFileSize(file.size) : "–"}
                        </TableCell>
                        <TableCell>
                          {file.lastModified
                            ? new Date(file.lastModified).toLocaleString()
                            : "–"}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => downloadFile(file.url!, file.key)}
                            disabled={!file.url}
                            title="Download"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {file && (
        <UploadFormModal
          file={file}
          open={uploadModalOpen}
          onSubmit={onSubmit}
          onCancel={() => {
            setUploadModalOpen(false);
            setFile(null);
          }}
        ></UploadFormModal>
      )}

      <Dialog open={uploadedFileInfoModalOpen}>
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

              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadFile(uploadedFile.url)}
                  sx={{ mt: 2 }}
                >
                  Download File
                </Button>
                <Button onClick={() => setUploadedFileInfoModalOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          ) : (
            <>
              <Typography variant="body2">No file uploaded</Typography>

              <DialogActions>
                <Button onClick={() => setUploadedFileInfoModalOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
};
