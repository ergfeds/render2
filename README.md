# Crypto Wallet Backend for Render

This repository contains the backend code for the Crypto Wallet application, configured for deployment on Render.

## TypeScript Error Resolution

This project uses TypeScript with some third-party libraries that may have missing type declarations. We've addressed this by:

1. Using custom type declarations in the `types/` directory:
   - `types/hono.d.ts` - Type declarations for Hono and related packages
   - `types/trpc-server.d.ts` - Type declarations for @trpc/server

2. Configuring TypeScript to bypass errors:
   - Using `skipLibCheck` to bypass strict type checking
   - Setting `noImplicitAny: false` to allow implicit any types
   - Setting `noEmitOnError: false` to emit JavaScript even when there are errors

3. Creating a robust build process that falls back to transpile-only mode if TypeScript compilation fails

## Deployment Steps

### 1. Prepare Repository

1. Create a new GitHub repository for the backend code
2. Upload all files from this folder to the repository:
   ```
   git init
   git add .
   git commit -m "Initial commit of backend code"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and create an account if you don't have one
2. Click on "New" and select "Web Service"
3. Connect your GitHub account and select the repository you created
4. Configure the following settings:
   - **Name**: `crypto-wallet-backend` (or your preferred name)
   - **Region**: Choose the region closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run setup`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select another plan if needed)

5. Click "Create Web Service"
6. Wait for the deployment to complete (this may take a few minutes)

### 3. Get Your Backend URL

1. Once deployed, Render will provide you with a URL for your service (e.g., `https://crypto-wallet-backend.onrender.com`)
2. Save this URL as you will need it to configure your frontend

## Frontend Configuration

After deploying your backend to Render, update the frontend's `lib/trpc.ts` file to point to your Render URL:

```typescript
// Add your Render backend URL (replace with your actual URL from Render)
const RENDER_BACKEND_URL = 'https://your-render-backend-url.onrender.com';

// Update the getBaseUrl function to use the Render URL
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
  
  // For local development
  // rest of your existing code...
};
```

## Troubleshooting Deployment Issues

### TypeScript Errors

If you encounter TypeScript errors during the build:

1. Check the build logs on Render
2. The build process is configured to handle TypeScript errors by:
   - First trying to build with `--skipLibCheck`
   - If that fails, trying with `--noEmitOnError false`
   - If all else fails, falling back to transpile-only mode

The `render-build.sh` script handles this process automatically.

### Runtime Errors

If your app is not working as expected after deployment:

1. Check the logs in the Render dashboard
2. Visit `https://your-render-url.onrender.com/debug` to see if the API is responding
3. Verify CORS settings if your frontend can't connect to the backend

## Local Development

To run the backend locally:

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

The server will run on port 3000 by default, or the port specified by the `PORT` environment variable. 