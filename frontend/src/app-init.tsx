import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { AuthProvider } from "./contexts/auth.context";
import { FileUploadProvider } from "./contexts/file-upload.context";
import { Home } from "./pages/home";
import theme from "./theme";
import { combineProviders } from "./utils/combine-providers";

const AllProviders = combineProviders([
  [StyledEngineProvider, { injectFirst: true }],
  [ThemeProvider, { theme }],
  [AuthProvider, {}],
  [FileUploadProvider, {}],
]);

function App() {
  return (
    <AllProviders>
      <CssBaseline />
      <Home />
    </AllProviders>
  );
}

export default App;
