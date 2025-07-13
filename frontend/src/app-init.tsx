import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { AuthProvider } from "./contexts/auth.context";
import { Home } from "./pages/home";
import theme from "./theme";

function App() {
  return (
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <Home />
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
