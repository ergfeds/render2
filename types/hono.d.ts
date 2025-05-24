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

declare module '@trpc/server' {
  export interface CreateRouterOptions { }
  
  export interface CreateProcedureOptions { }

  export interface ProcedureBuilder<T extends object> {
    input<TInput>(schema: any): ProcedureBuilder<T>;
    output<TOutput>(schema: any): ProcedureBuilder<T>;
    query<TResult>(resolver: (opts: any) => Promise<TResult> | TResult): Procedure<T>;
    mutation<TResult>(resolver: (opts: any) => Promise<TResult> | TResult): Procedure<T>;
  }

  export interface Procedure<T extends object> {}

  export interface RouterBuilder<T extends object> {
    procedure: ProcedureBuilder<T>;
    query: ProcedureBuilder<T>;
    mutation: ProcedureBuilder<T>;
  }

  export interface Router<T extends object> {
    _def: any;
  }

  export interface InitTRPCOptions {
    context<TContext>(): {
      create: () => {
        router: <T extends object>(procedures: T) => Router<T>;
        procedure: ProcedureBuilder<any>;
        query: ProcedureBuilder<any>;
        mutation: ProcedureBuilder<any>;
      };
    };
  }

  export const initTRPC: InitTRPCOptions;
  export const router: any;
  export const publicProcedure: any;
  export const middleware: any;
  export const mergeRouters: any;
} 