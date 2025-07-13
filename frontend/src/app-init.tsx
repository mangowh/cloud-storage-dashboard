import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { AuthProvider } from "./contexts/auth.context";
import { Home } from "./pages/home";
import theme from "./theme";
import { NotificationsProvider } from "@toolpad/core/useNotifications";

function App() {
  return (
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <NotificationsProvider
            slotProps={{
              snackbar: {
                anchorOrigin: { vertical: "top", horizontal: "center" },
              },
            }}
          >
            <CssBaseline />
            <Home />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
