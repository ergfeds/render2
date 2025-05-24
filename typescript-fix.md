# TypeScript Error Fix Guide

This guide provides step-by-step instructions to fix the TypeScript errors in the backend code.

## Error Overview

You're encountering the following types of errors:
1. Missing module declarations for Hono and related packages
2. ESM import path resolution requiring file extensions
3. Implicit 'any' type errors

## Step 1: Install Type Declarations

```bash
# Navigate to the render-backend directory
cd render-backend

# Install Hono type declarations
npm install --save-dev @types/hono
```

## Step 2: Fix tsconfig.json

Update your `tsconfig.json` to use CommonJS modules and disable strict typing temporarily:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 3: Fix server.js Entry Point

Update `server.js` to use CommonJS require instead of ES imports:

```javascript
// This is the entry point for the Render deployment
// It uses the compiled TypeScript code from the dist folder

// Use the compiled JavaScript files
require('./dist/backend/server.js');
```

## Step 4: Fix server.ts

Add type annotations to `server.ts`:

```typescript
import app from './hono';
import { serve } from '@hono/node-server';

// Use the PORT environment variable that Render sets, or default to 3000 if not set
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Log that the server is starting
console.log(`Starting server on port ${PORT}...`);

// Define the type for the info parameter
interface ServerInfo {
  port: number;
}

// Start the server on the specified port
serve({
  fetch: app.fetch,
  port: PORT,
}, (info: ServerInfo) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  console.log(`API is available at http://localhost:${info.port}/api`);
  console.log(`TRPC is available at http://localhost:${info.port}/api/trpc`);
  
  // Log for Render deployment
  console.log(`For Render deployment, URLs will use the provided hostname instead of localhost`);
});
```

## Step 5: Fix hono.ts

Add type annotations to `hono.ts`:

```typescript
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import type { Context } from 'hono';

// app will be mounted at the root, not at /api
const app = new Hono();

// Enable CORS for all routes with more permissive settings
app.use("*", cors({
  origin: '*', // Allow all origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

// Add a middleware to log requests for debugging
app.use("*", async (c: Context, next: () => Promise<void>) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  try {
    await next();
  } catch (err) {
    console.error("Error in request:", err);
    throw err;
  }
});

// Mount tRPC router at /api/trpc to match client expectations
app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ path, error }: { path: string, error: Error }) => {
      console.error(`[tRPC] Error in ${path}:`, error);
    },
  })
);

// Simple health check endpoint
app.get("/", (c: Context) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Add a debug endpoint to help with connection testing
app.get("/debug", (c: Context) => {
  return c.json({
    status: "ok",
    message: "Debug endpoint reached successfully",
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(c.req.headers.entries()),
    url: c.req.url,
    method: c.req.method,
  });
});

export default app;
```

## Alternative Approach: Using Declaration Files

If the above steps don't resolve all errors, you can create declaration files:

1. Create a file `render-backend/types/hono.d.ts`:

```typescript
declare module 'hono' {
  export class Hono {
    fetch: any;
    use(path: string, middleware: any): this;
    get(path: string, handler: any): this;
    post(path: string, handler: any): this;
    put(path: string, handler: any): this;
    delete(path: string, handler: any): this;
  }
  
  export interface Context {
    req: {
      method: string;
      url: string;
      headers: {
        entries(): [string, string][];
      };
    };
    json(data: any): Response;
  }
}

declare module 'hono/cors' {
  export function cors(options: any): any;
}

declare module '@hono/trpc-server' {
  export function trpcServer(options: any): any;
}

declare module '@hono/node-server' {
  export function serve(options: any, callback: any): void;
}
```

2. Include this file in your `tsconfig.json`:

```json
{
  "include": ["**/*.ts", "types/**/*.d.ts"]
}
```

## Building After Fixes

After applying these fixes, build your project:

```bash
npm run build
```

If you're still encountering errors, consider temporarily using the `--skipLibCheck` flag:

```bash
npx tsc --skipLibCheck
``` 