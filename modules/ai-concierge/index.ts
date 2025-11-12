// modules/ai-concierge/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useAIConcierge } from './logic/useAIConcierge';

const aiConciergeModule: IModule = {
  name: 'AI Concierge',
  version: '1.0.0',
  description: 'AI-powered concierge for guest services',
  services: [
    {
      name: 'aiConciergeService',
      instance: useAIConcierge,
      dependencies: [],
    },
  ],
  routes: [],
};

export default aiConciergeModule;