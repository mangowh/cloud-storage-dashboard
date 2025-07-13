import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { AuthProvider } from "./contexts/auth.context";
import { FileUploadProvider } from "./contexts/file-upload.context";
import { Home } from "./pages/home";
import theme from "./theme";

// const AllProviders = combineProviders([
//   [StyledEngineProvider, { injectFirst: true }],
//   [ThemeProvider, { theme }],

//   [AuthProvider, {}],
//   [FileUploadProvider, {}],
// ]);

function App() {
  return (
    // <AllProviders>
    <StyledEngineProvider injectFirst={true}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <FileUploadProvider>
            <CssBaseline />
            <Home />
          </FileUploadProvider>
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
    // </AllProviders>
  );
}

export default App;
