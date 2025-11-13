// core/di/Container.ts
type ServiceFactory = (...args: unknown[]) => unknown;
type ServiceEntry = {
  service: ServiceFactory | unknown;
  dependencies: string[];
};

class Container {
  private services: Map<string, ServiceEntry> = new Map();

  register(name: string, service: ServiceFactory | unknown, dependencies: string[] = []) {
    this.services.set(name, { service, dependencies });
  }

  resolve(name: string): unknown {
    const entry = this.services.get(name);
    if (!entry) throw new Error(`Service ${name} not found`);

    if (typeof entry.service === 'function') {
      const deps = entry.dependencies.map((dep: string) => this.resolve(dep));
      return (entry.service as ServiceFactory)(...deps);
    }

    return entry.service;
  }

  getAll(): Map<string, ServiceEntry> {
    return this.services;
  }
}

export const container = new Container();