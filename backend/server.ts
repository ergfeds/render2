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