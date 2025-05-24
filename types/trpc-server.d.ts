declare module '@trpc/server' {
  export interface Context {
    [key: string]: any;
  }

  export interface Procedure {
    [key: string]: any;
  }

  export interface ProcedureBuilder {
    input: (schema: any) => ProcedureBuilder;
    output: (schema: any) => ProcedureBuilder;
    query: (fn: (opts: any) => any) => Procedure;
    mutation: (fn: (opts: any) => any) => Procedure;
  }

  export interface TRPCBuilder {
    router: (routes: Record<string, any>) => any;
    procedure: ProcedureBuilder;
    middleware: (fn: (opts: any) => any) => any;
    context: <T>() => {
      create: () => {
        router: (routes: Record<string, any>) => any;
        procedure: ProcedureBuilder;
      }
    };
  }

  export const initTRPC: TRPCBuilder;
  export const router: (routes: Record<string, any>) => any;
  export const procedure: ProcedureBuilder;
  export const publicProcedure: ProcedureBuilder;
  export const middleware: (fn: (opts: any) => any) => any;
  export const mergeRouters: (...routers: any[]) => any;
} 