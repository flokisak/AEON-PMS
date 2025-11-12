// core/moduleLoader.ts
import { IModule } from './interfaces/IModule';
import { container } from './di/Container';
import { supabase } from './config/supabaseClient';

export class ModuleLoader {
  private modules: Map<string, IModule> = new Map();

  async loadActiveModules(): Promise<void> {
    try {
      const { data: activeModules, error } = await supabase
        .from('modules')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      for (const modConfig of activeModules) {
        await this.loadModule(modConfig.module_path);
      }
    } catch (error) {
      console.error('Failed to load active modules:', error);
    }
  }

  async loadModule(modulePath: string): Promise<void> {
    try {
      // TODO: Implement static module loading for Next.js compatibility
      // const module = await import(modulePath);
      // const mod: IModule = module.default;

      // For now, skip dynamic loading
      console.log(`Module ${modulePath} loading skipped for Next.js compatibility`);
    } catch (error) {
      console.error(`Failed to load module ${modulePath}:`, error);
    }
  }

  unloadModule(name: string): void {
    // Unregister services
    const mod = this.modules.get(name);
    if (mod) {
      mod.services.forEach(service => {
        container.getAll().delete(service.name);
      });
      this.modules.delete(name);
      console.log(`Module ${name} unloaded`);
    }
  }

  getModule(name: string): IModule | undefined {
    return this.modules.get(name);
  }

  getAllModules(): IModule[] {
    return Array.from(this.modules.values());
  }
}

export const moduleLoader = new ModuleLoader();