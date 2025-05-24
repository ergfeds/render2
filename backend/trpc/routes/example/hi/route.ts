import { publicProcedure } from '@/backend/trpc/create-context';

const hiProcedure = publicProcedure.query(() => {
  return {
    greeting: 'Hello from tRPC!',
    timestamp: new Date().toISOString(),
  };
});

export default hiProcedure;