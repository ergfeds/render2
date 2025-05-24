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