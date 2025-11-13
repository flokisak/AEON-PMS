// core/interfaces/IController.ts
export interface IController {
  name: string;
  routes: IRoute[];
}

export interface IRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: (req: unknown, res: unknown) => Promise<unknown>;
  middleware?: unknown[];
}