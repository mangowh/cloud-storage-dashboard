import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth.context";

export const Header = () => {
  const auth = useAuth();
  const notifications = useNotifications();

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

      notifications.show("Login success", {
        severity: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error(err);

      notifications.show("Login error. Check credentials", {
        severity: "error",
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: "1" }}>
            Cloud Storage Dashboard
          </Typography>

          {auth.user ? (
            <>
              <Button
                color="inherit"
                onClick={async () => {
                  try {
                    await auth.logout();

                    notifications.show("Correctly logged out", {
                      autoHideDuration: 3000,
                    });
                  } catch (err) {
                    console.error(err);

                    notifications.show("Logout error. Try again", {
                      severity: "error",
                      autoHideDuration: 5000,
                    });
                  }
                }}
              >
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

      <Dialog
        open={loginModalIsOpen}
        onClose={() => {
          setTimeout(() => {
            setUsername("");
            setPassword("");
          }, 100);
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle>Login</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setLoginModalIsOpen(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
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
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
