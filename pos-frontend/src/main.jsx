import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./contexts/ThemeContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime : 30000,
    }
  }
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider autoHideDuration={3000}>
        <QueryClientProvider client={queryClient} >
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </SnackbarProvider>

    </Provider>
  </StrictMode>
);
