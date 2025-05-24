import { initTRPC } from '@trpc/server';

// Create context - this would typically include things like database connections, auth, etc.
export const createContext = async () => {
  return {
    // Add your context properties here
  };
};

// Initialize tRPC
const t = initTRPC.context<typeof createContext>().create();

// Export procedures
export const router = t.router;
export const publicProcedure = t.procedure;