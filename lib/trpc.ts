// This file is a simplified version of the original trpc.ts for backend use only
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../backend/trpc/app-router';

// Create a vanilla client for server-side use if needed
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      fetch: (url, options) => {
        console.log(`Making server-side request to: ${url}`);
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          if (!response.ok) {
            console.error(`API response error: ${response.status} ${response.statusText}`);
          }
          return response;
        })
        .catch(err => {
          console.error('Network error during fetch:', err);
          throw err;
        });
      },
    }),
  ],
}); 