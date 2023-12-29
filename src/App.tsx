import { ThemeProvider } from "@emotion/react";

import Router from "./Router";
import "@fontsource/tajawal";
import theme from "./context/Theme";
import "./css/App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
};

export default App;
