// core/di/Container.ts
class Container {
  private services: Map<string, any> = new Map();

  register(name: string, service: any, dependencies: string[] = []) {
    this.services.set(name, { service, dependencies });
  }

  resolve(name: string): any {
    const entry = this.services.get(name);
    if (!entry) throw new Error(`Service ${name} not found`);

    if (typeof entry.service === 'function') {
      const deps = entry.dependencies.map((dep: string) => this.resolve(dep));
      return entry.service(...deps);
    }

    return entry.service;
  }

  getAll(): Map<string, any> {
    return this.services;
  }
}

export const container = new Container();