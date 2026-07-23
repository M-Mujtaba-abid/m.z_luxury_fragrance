// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       gcTime: 15 * 60 * 1000, // 15 minutes
//       refetchOnWindowFocus: false,
//       retry: 1,
//     },
//   },
// });

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store={store}>
//       <QueryClientProvider client={queryClient}>
//         <App />
//       </QueryClientProvider>
//     </Provider>
//   </StrictMode>,
// )



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import App from "./App";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import {
  PersistQueryClientProvider,
  persistOptions,
  queryClient,
} from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={persistOptions}
        >
          <App />
        </PersistQueryClientProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);