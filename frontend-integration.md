# Frontend Integration Guide

This guide explains how to update your Expo frontend app to connect to the Render-deployed backend.

## 1. Update the API Configuration

After deploying your backend to Render, you'll need to modify the `lib/trpc.ts` file in your frontend application:

1. Open `internal-crypto-wallet-system (3)/lib/trpc.ts`
2. Add the following code:

```typescript
// Original variables - keep these for local development
const LOCAL_IP_ADDRESS = '192.168.218.20'; 
const API_PORT = '3001';

// Add your Render backend URL (replace with your actual URL from Render)
const RENDER_BACKEND_URL = 'https://your-render-backend-url.onrender.com';

// Modify the getBaseUrl function to use the Render URL
const getBaseUrl = () => {
  // For web, use relative URL which will work with same-origin requests
  if (Platform.OS === 'web') {
    return '/api/trpc';
  }
  
  // Set this to true to use the Render backend, false to use local development
  const useProductionBackend = true;
  
  if (useProductionBackend) {
    return `${RENDER_BACKEND_URL}/api/trpc`;
  }
  
  // For mobile in development, use the local IP address
  if (Platform.OS === 'android') {
    return `http://${LOCAL_IP_ADDRESS}:${API_PORT}/api/trpc`;
  } else {
    // iOS
    return `http://localhost:${API_PORT}/api/trpc`;
  }
};
```

## 2. Test the Connection

1. Make sure your Render backend is up and running
2. Start your Expo app:
   ```
   cd "internal-crypto-wallet-system (3)"
   npm start
   ```
3. Try to log in or perform any API operation to verify the connection

## 3. Troubleshooting

### CORS Issues

If you encounter CORS errors, your Render backend needs to allow requests from your frontend. The backend already has CORS configured to allow all origins (`*`), but you may need to adjust it if you're seeing issues.

Check the CORS configuration in `backend/hono.ts`:

```typescript
// Enable CORS for all routes with more permissive settings
app.use("*", cors({
  origin: '*', // This allows all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));
```

### Connection Issues

If your app can't connect to the backend:

1. Verify your Render URL is correct and the service is running
2. Check that you've set `useProductionBackend = true` in the `getBaseUrl` function
3. Try accessing your Render URL directly in a browser (e.g., `https://your-render-backend-url.onrender.com`)
4. Check the Render logs for any errors

## 4. Switching Between Development and Production

To easily switch between your local development backend and the Render backend:

```typescript
// In lib/trpc.ts
const useProductionBackend = false; // Set to false for local development, true for Render
```

This lets you toggle between environments without changing the URLs. 