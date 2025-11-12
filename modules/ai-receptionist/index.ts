// modules/ai-receptionist/index.ts
import { IModule } from '../../core/interfaces/IModule';
import { useAIReceptionist } from './logic/useAIReceptionist';

const receptionist = useAIReceptionist();

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
      handler: async (req: any, res: any) => {
        const { reservationId } = req.body;
        const result = await receptionist.handleCheckIn(reservationId);
        res.status(result.success ? 200 : 400).json(result);
      },
    },
    {
      path: '/api/ai-receptionist/check-out',
      method: 'POST',
      handler: async (req: any, res: any) => {
        const { reservationId } = req.body;
        const result = await receptionist.handleCheckOut(reservationId);
        res.status(result.success ? 200 : 400).json(result);
      },
    },
    {
      path: '/api/ai-receptionist/ask',
      method: 'POST',
      handler: async (req: any, res: any) => {
        const { question } = req.body;
        const answer = await receptionist.answerQuestion(question);
        res.status(200).json({ answer });
      },
    },
    {
      path: '/api/ai-receptionist/workflow',
      method: 'POST',
      handler: async (req: any, res: any) => {
        const { action, params } = req.body;
        const result = await receptionist.executeWorkflow(action, params);
        if (typeof result === 'string') {
          res.status(200).json({ answer: result });
        } else {
          res.status(result.success ? 200 : 400).json(result);
        }
      },
    },
    {
      path: '/api/ai-receptionist/assign-room',
      method: 'POST',
      handler: async (req: any, res: any) => {
        const { reservationId, preferences } = req.body;
        const result = await receptionist.assignRoom(reservationId, preferences);
        res.status(result.success ? 200 : 400).json(result);
      },
    },
  ],
};

export default aiReceptionistModule;