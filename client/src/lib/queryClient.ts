import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// -----------------------------
// React Query Client
// -----------------------------
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 1000 * 60 * 5,

            // Keep unused cache for 15 minutes
            gcTime: 1000 * 60 * 15,

            // Better UX
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,

            retry: 1,

            // Network mode
            networkMode: "online",
        },
        mutations: {
            retry: 1,
            networkMode: "online",
        },
    },
});

// -----------------------------
// Local Storage Persister
// -----------------------------
export const persister = createSyncStoragePersister({
    storage: window.localStorage,
});

// -----------------------------
// Persist Options
// -----------------------------
export const persistOptions = {
    persister,

    maxAge: 1000 * 60 * 60 * 24, // 24 Hours

    buster: "v1", // Change this whenever cache structure changes
};

export { PersistQueryClientProvider };