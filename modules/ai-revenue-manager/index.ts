// modules/ai-revenue-manager/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useAIRevenueManager } from './logic/useAIRevenueManager';

const aiRevenueManagerModule: IModule = {
  name: 'AI Revenue Manager',
  version: '1.0.0',
  description: 'AI-powered revenue management and pricing optimization',
  services: [
    {
      name: 'aiRevenueManagerService',
      instance: useAIRevenueManager,
      dependencies: [],
    },
  ],
  routes: [],
};

export default aiRevenueManagerModule;