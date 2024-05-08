import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import createIDBPersister from "./stores/createIDBPersister.ts";
import queryClient from "./stores/queryClient.ts";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: createIDBPersister() }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
