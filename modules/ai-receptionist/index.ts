// modules/ai-receptionist/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useAIReceptionist } from './logic/useAIReceptionist';

const aiReceptionistModule: IModule = {
  name: 'AI Receptionist',
  version: '1.0.0',
  description: 'AI-powered receptionist for check-in, check-out, and guest inquiries',
  services: [
    {
      name: 'aiReceptionistService',
      instance: useAIReceptionist,
      dependencies: [],
    },
  ],
  routes: [
    {
      path: '/api/ai-receptionist/check-in',
      method: 'POST',
      handler: async (req: unknown, res: unknown) => {
        // Note: This is a mock implementation since we can't use hooks at module level
        const result = { success: true, message: 'Check-in processed' };
        (res as { status: (code: number) => { json: (data: unknown) => void } }).status(result.success ? 200 : 400).json(result);
      },
    },
    {
      path: '/api/ai-receptionist/check-out',
      method: 'POST',
      handler: async (req: unknown, res: unknown) => {
        // Note: This is a mock implementation since we can't use hooks at module level
        const result = { success: true, message: 'Check-out processed' };
        (res as { status: (code: number) => { json: (data: unknown) => void } }).status(result.success ? 200 : 400).json(result);
      },
    },
    {
      path: '/api/ai-receptionist/ask',
      method: 'POST',
      handler: async (req: unknown, res: unknown) => {
        const { question } = (req as { body: { question: string } }).body;
        // Note: This is a mock implementation since we can't use hooks at module level
        const answer = 'This is a mock answer to: ' + question;
        (res as { status: (code: number) => { json: (data: unknown) => void } }).status(200).json({ answer });
      },
    },
    {
      path: '/api/ai-receptionist/workflow',
      method: 'POST',
      handler: async (req: unknown, res: unknown) => {
        const { action } = (req as { body: { action: string } }).body;
        // Note: This is a mock implementation since we can't use hooks at module level
        const result = { success: true, message: `Workflow ${action} executed` };
        (res as { status: (code: number) => { json: (data: unknown) => void } }).status(result.success ? 200 : 400).json(result);
      },
    },
    {
      path: '/api/ai-receptionist/assign-room',
      method: 'POST',
      handler: async (req: unknown, res: unknown) => {
        // Note: This is a mock implementation since we can't use hooks at module level
        const result = { success: true, message: 'Room assigned' };
        (res as { status: (code: number) => { json: (data: unknown) => void } }).status(result.success ? 200 : 400).json(result);
      },
    },
  ],
};

export default aiReceptionistModule;