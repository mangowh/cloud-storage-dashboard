import {
  AppBar,
  Box,
  Button,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth.context";

export const Header = () => {
  const auth = useAuth();

  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loginModalIsOpen) usernameRef.current?.focus();
  }, [loginModalIsOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await auth.login(username, password);

      setUsername("");
      setPassword("");

      setLoginModalIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: "1" }}>
            Cloud Storage Dashboard
          </Typography>

          {auth.user ? (
            <>
              ciao {auth.user.name}
              <Button color="inherit" onClick={() => auth.logout()}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => setLoginModalIsOpen(true)}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={loginModalIsOpen}
        onClose={() => setLoginModalIsOpen(false)}
        aria-labelledby="login-dialog-title"
        aria-describedby="login-dialog-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-dialog-title"
          aria-describedby="login-dialog-description"
          sx={{
            width: 360,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography id="login-dialog-title" variant="h6">
            Login
          </Typography>
          <Typography id="login-dialog-description" variant="body2">
            Enter your username and password to sign in.
          </Typography>
          <TextField
            inputRef={usernameRef}
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            autoComplete="username"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setLoginModalIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
