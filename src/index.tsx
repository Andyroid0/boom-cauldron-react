import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./css/index.css";

import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
