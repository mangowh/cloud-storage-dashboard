import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useFileUpload } from "../contexts/file-upload.context";

export const Header = () => {
  const fileUpload = useFileUpload();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cloud Storage Dashboard
        </Typography>

        {JSON.stringify(fileUpload.files)}

        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};
