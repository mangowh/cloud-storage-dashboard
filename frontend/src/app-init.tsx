import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { Home } from "./pages/home";
import theme from "./theme";
import { combineProviders } from "./utils/combine-providers";
import { FileUploadProvider } from "./contexts/file-upload.context";

const AllProviders = combineProviders([
  [StyledEngineProvider, { injectFirst: true }],
  [ThemeProvider, { theme }],

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
