import { useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Guest {
  name: string;
  room: number;
  checkedIn: boolean;
  accessCode: string;
  wifiPassword: string;
}

export interface WorkflowStep {
  id: string;
  action: string;
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export function useAIConcierge() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Concierge. I can help with check-in, room access, recommendations, and answer your questions. How can I assist you?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'checkin',
      name: 'Check-in Process',
      steps: [
        { id: '1', action: 'Verify reservation', description: 'Check guest reservation details' },
        { id: '2', action: 'Generate access codes', description: 'Create room and parking access codes' },
        { id: '3', action: 'Send welcome message', description: 'Send WiFi password and local info' },
        { id: '4', action: 'Confirm check-in', description: 'Mark guest as checked in' },
      ],
    },
    {
      id: 'checkout',
      name: 'Check-out Process',
      steps: [
        { id: '1', action: 'Calculate bill', description: 'Compute total charges' },
        { id: '2', action: 'Process payment', description: 'Handle payment if needed' },
        { id: '3', action: 'Deactivate codes', description: 'Disable access codes' },
        { id: '4', action: 'Send feedback request', description: 'Ask for review' },
      ],
    },
  ]);

  const faqs = {
    'wifi': 'Our WiFi password is "HotelGuest2023". It\'s available throughout the hotel.',
    'check-in': 'Check-in time is 3 PM. If you arrive early, we can store your luggage.',
    'check-out': 'Check-out time is 11 AM. Late check-out may be available upon request.',
    'parking': 'Free parking is available in our underground garage.',
    'restaurant': 'Our restaurant serves breakfast from 7-10 AM, lunch 12-3 PM, and dinner 6-10 PM.',
  };

  const generateCodes = () => ({
    accessCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    wifiPassword: 'HotelGuest2023',
  });

  const checkInGuest = (name: string, room: number) => {
    const codes = generateCodes();
    const guest: Guest = {
      name,
      room,
      checkedIn: true,
      ...codes,
    };
    setCurrentGuest(guest);
    return guest;
  };

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Process message
    const lowerText = text.toLowerCase();
    let response = '';

    if (lowerText.includes('check in') || lowerText.includes('check-in')) {
      if (currentGuest) {
        response = `You're already checked in, ${currentGuest.name}! Your room access code is ${currentGuest.accessCode}.`;
      } else {
        // Mock check-in
        const guest = checkInGuest('John Doe', 101);
        response = `Welcome, ${guest.name}! I've checked you into room ${guest.room}. Your room access code is ${guest.accessCode}, and WiFi password is "${guest.wifiPassword}". Enjoy your stay!`;
      }
    } else if (lowerText.includes('wifi') || lowerText.includes('internet')) {
      response = faqs.wifi;
    } else if (lowerText.includes('parking')) {
      response = faqs.parking;
    } else if (lowerText.includes('restaurant') || lowerText.includes('food')) {
      response = faqs.restaurant;
    } else if (lowerText.includes('check-out') || lowerText.includes('checkout')) {
      response = faqs['check-out'];
    } else if (lowerText.includes('access') || lowerText.includes('code')) {
      if (currentGuest) {
        response = `Your room access code is ${currentGuest.accessCode}.`;
      } else {
        response = 'Please check in first to receive your access code.';
      }
    } else {
      // General response
      response = 'I\'m here to help! You can ask about check-in, WiFi, parking, restaurant hours, or any other hotel services.';
    }

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const updateWorkflow = (workflowId: string, updatedWorkflow: Workflow) => {
    setWorkflows(prev => prev.map(w => w.id === workflowId ? updatedWorkflow : w));
  };

  const addWorkflowStep = (workflowId: string, step: WorkflowStep) => {
    setWorkflows(prev => prev.map(w =>
      w.id === workflowId ? { ...w, steps: [...w.steps, step] } : w
    ));
  };

  const removeWorkflowStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === workflowId ? { ...w, steps: w.steps.filter(s => s.id !== stepId) } : w
    ));
  };

  return {
    messages,
    isTyping,
    sendMessage,
    currentGuest,
    workflows,
    updateWorkflow,
    addWorkflowStep,
    removeWorkflowStep,
  };
}