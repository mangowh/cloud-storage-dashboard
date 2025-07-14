import { ObjectDto } from "@bonusx/cloud-storage-dashboard-api-client";
import CloseIcon from "@mui/icons-material/Close";
import CopyIcon from "@mui/icons-material/CopyAll";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useEffect, useState } from "react";
import FileUploader from "../components/file-uploader";
import { Header } from "../components/header";
import { UploadFormModal } from "../components/upload-form-modal";
import { useAuth } from "../contexts/auth.context";
import { apiService } from "../services/api.service";
import { copyToClipboard } from "../utils/copy-to-clipboard";
import { downloadFile } from "../utils/download-file";
import { formatFileSize } from "../utils/format-file-size";

export const Home = () => {
  const auth = useAuth();
  const notifications = useNotifications();

  const [file, setFile] = useState<File | null>();
  const [retrievedFiles, setRetrievedObjects] = useState<ObjectDto[] | null>(
    null,
  );

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [uploadedFileInfoModalOpen, setUploadedFileInfoModalOpen] =
    useState(false);
  const [uploadedFile, setUploadedFile] = useState<ObjectDto | null>(null);

  useEffect(() => {
    updateFilesList();
  }, []);

  useEffect(() => {
    if (file) {
      if (!auth.user) {
        notifications.show("You need to be logged in to upload a file", {
          severity: "error",
          autoHideDuration: 5000,
        });
        setFile(null);
        return;
      }

      setUploadModalOpen(true);
    }
  }, [file]);

  const updateFilesList = async () => {
    try {
      apiService.s3
        .getObjects()
        .then((files) => setRetrievedObjects(files.items));
    } catch (err) {
      console.error(err);
      notifications.show("Error retrieving object list", {
        severity: "error",
        autoHideDuration: 5000,
      });
    }
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

        notifications.show("File correctly uploaded", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (err) {
        console.error(err);
        notifications.show("Error during loading. Check your login status", {
          severity: "error",
          autoHideDuration: 5000,
        });
      }
    }
  };

  const handleDownload = async (url: string, name?: string) => {
    try {
      downloadFile(url, name);
    } catch (err) {
      console.error(err);
      notifications.show("Error during download. Please try again", {
        autoHideDuration: 5000,
      });
    }
  };

  const handleCopyToClipboard = async (url: string) => {
    try {
      await copyToClipboard(url);
      notifications.show("Signed URL copied to clipboard", {
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show("Error during copy to clipboard", {
        autoHideDuration: 5000,
      });
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
                {retrievedFiles ? (
                  <>
                    {retrievedFiles.length > 0 ? (
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
                              <strong>Actions</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {retrievedFiles.map((file) => (
                            <TableRow key={file.key}>
                              <TableCell>{file.key}</TableCell>
                              <TableCell>
                                {file.size ? formatFileSize(file.size) : "-"}
                              </TableCell>
                              <TableCell>
                                {file.lastModified
                                  ? file.lastModified.toLocaleString()
                                  : "-"}
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Copy Signed URL">
                                  <IconButton
                                    color="secondary"
                                    onClick={() =>
                                      handleCopyToClipboard(file.url)
                                    }
                                  >
                                    <CopyIcon />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Download">
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleDownload(file.url, file.key)
                                    }
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Box
                        sx={{
                          p: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography>No file uploaded</Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
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

      {uploadedFile && (
        <Dialog open={uploadedFileInfoModalOpen} maxWidth="sm" fullWidth>
          <DialogTitle>File uploaded successfully</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setUploadedFileInfoModalOpen(false)}
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
            <Typography variant="body2" color="text.secondary">
              <strong>Key:</strong> {uploadedFile.key}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Size:</strong> {formatFileSize(uploadedFile.size)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Signed URL:</strong> {uploadedFile.url}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleCopyToClipboard(uploadedFile.url)}
              startIcon={<CopyIcon />}
            >
              Copy Signed URL
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleDownload(uploadedFile.url);
              }}
              startIcon={<DownloadIcon />}
            >
              Download File
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
