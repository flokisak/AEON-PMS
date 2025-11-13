'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMessageSquare, FiCheckCircle, FiXCircle, FiClock, FiHome, FiTool, FiCoffee, FiWifi, FiPhone, FiSettings } from 'react-icons/fi';
import { useAIReceptionist } from '../../ai-receptionist/logic/useAIReceptionist';

interface AIRequest {
  id: string;
  type: 'checkin' | 'checkout' | 'housekeeping' | 'taxi' | 'room_service' | 'information' | 'maintenance';
  guestName?: string;
  roomNumber?: string;
  request: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  response?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  color: string;
}

export function AIReceptionist() {
  const { t } = useTranslation('common');
  const { executeWorkflow, answerQuestion } = useAIReceptionist();
  const [activeTab, setActiveTab] = useState<'chat' | 'requests' | 'automation'>('chat');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState<AIRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I am your AI Receptionist. How can I assist you today?' },
    { role: 'user', content: 'What is the WiFi password?' },
    { role: 'assistant', content: 'The WiFi password is HotelGuest2024. You can also find this information in your room welcome packet.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load real requests from database on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    // This would load real requests from database
    // For now, keeping empty array to show real data when available
    setRequests([]);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'auto-checkin',
      title: t('aiReceptionist.autoCheckIn'),
      description: t('aiReceptionist.autoCheckInDesc'),
      icon: <FiCheckCircle className="w-5 h-5" />,
      action: 'auto_checkin',
      color: 'bg-green-500'
    },
    {
      id: 'housekeeping',
      title: t('aiReceptionist.requestHousekeeping'),
      description: t('aiReceptionist.requestHousekeepingDesc'),
      icon: <FiHome className="w-5 h-5" />,
      action: 'housekeeping',
      color: 'bg-blue-500'
    },
    {
      id: 'taxi',
      title: t('aiReceptionist.callTaxi'),
      description: t('aiReceptionist.callTaxiDesc'),
      icon: <FiPhone className="w-5 h-5" />,
      action: 'taxi',
      color: 'bg-yellow-500'
    },
    {
      id: 'room-service',
      title: t('aiReceptionist.roomService'),
      description: t('aiReceptionist.roomServiceDesc'),
      icon: <FiCoffee className="w-5 h-5" />,
      action: 'room_service',
      color: 'bg-purple-500'
    },
    {
      id: 'maintenance',
      title: t('aiReceptionist.maintenance'),
      description: t('aiReceptionist.maintenanceDesc'),
      icon: <FiTool className="w-5 h-5" />,
      action: 'maintenance',
      color: 'bg-red-500'
    },
    {
      id: 'information',
      title: t('aiReceptionist.hotelInformation'),
      description: t('aiReceptionist.hotelInformationDesc'),
      icon: <FiWifi className="w-5 h-5" />,
      action: 'information',
      color: 'bg-indigo-500'
    }
  ];

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    const newRequest: AIRequest = {
      id: Date.now().toString(),
      type: action as 'checkin' | 'checkout' | 'room_service' | 'housekeeping' | 'taxi' | 'maintenance',
      request: `Quick action: ${action}`,
      status: 'processing',
      timestamp: new Date().toISOString()
    };

    setRequests(prev => [newRequest, ...prev]);

    try {
      const result = await executeWorkflow(action, { action });
      
      setRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { 
                ...req, 
                status: (result as { success?: boolean }).success ? 'completed' : 'failed', 
                response: (result as { success?: boolean }).success ? generateResponse(action) : (result as { error?: string }).error || 'Request failed'
              }
            : req
        )
      );
    } catch (error) {
      setRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'failed', response: 'Request failed due to system error' }
            : req
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (action: string): string => {
    switch (action) {
      case 'auto_checkin':
        return 'Automatic check-in initiated. Guest will receive room access code via SMS.';
      case 'housekeeping':
        return 'Housekeeping team notified. Expected response time: 15 minutes.';
      case 'taxi':
        return 'Taxi called through City Taxi service. ETA: 10 minutes. Vehicle: Yellow Skoda Octavia.';
      case 'room_service':
        return 'Room service order received. Menu sent to guest room. Delivery time: 25 minutes.';
      case 'maintenance':
        return 'Maintenance team alerted. Priority: Medium. Expected arrival: 30 minutes.';
      case 'information':
        return 'Information packet sent to guest email and room tablet.';
      default:
        return 'Request processed successfully.';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await answerQuestion(message);
      setChatMessages(prev => [...prev, { role: 'assistant' as const, content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: 'I apologize, but I encountered an error. Please try again or contact the front desk.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('wifi') || lowerMessage.includes('password')) {
      return 'The WiFi password is HotelGuest2024. Network name: HotelGuest_Premium.';
    }
    if (lowerMessage.includes('breakfast') || lowerMessage.includes('food')) {
      return 'Breakfast is served from 7:00 AM to 10:00 AM in the main dining room. Room service is available 24/7.';
    }
    if (lowerMessage.includes('checkout') || lowerMessage.includes('check out')) {
      return 'Check-out time is 11:00 AM. Late check-out is available until 2:00 PM for an additional fee.';
    }
    if (lowerMessage.includes('parking')) {
      return 'Free parking is available in our underground garage. Please take your room key for access.';
    }
    if (lowerMessage.includes('pool') || lowerMessage.includes('swim')) {
      return 'The swimming pool is open from 6:00 AM to 10:00 PM. Towels are provided at the pool area.';
    }
    if (lowerMessage.includes('gym') || lowerMessage.includes('fitness')) {
      return 'The fitness center is open 24/7 for hotel guests. Your room key provides access.';
    }
    if (lowerMessage.includes('taxi') || lowerMessage.includes('transport')) {
      return 'I can call a taxi for you right away. Would you like me to arrange one?';
    }
    
    return 'I understand your request. Let me connect you with the appropriate service or provide more information.';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="w-4 h-4" />;
      case 'processing': return <FiClock className="w-4 h-4" />;
      case 'failed': return <FiXCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <FiMessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Receptionist</h2>
          <p className="text-sm text-neutral-dark">24/7 Automated guest services</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'chat' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
          }`}
        >
          <FiMessageSquare className="w-4 h-4" />
          <span>{t('aiReceptionist.chat')}</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'requests' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
          }`}
        >
          <FiClock className="w-4 h-4" />
          <span>{t('aiReceptionist.requests')}</span>
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'automation' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'
          }`}
        >
          <FiSettings className="w-4 h-4" />
          <span>{t('aiReceptionist.automation')}</span>
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-light text-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-light text-foreground px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-neutral-medium">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('aiReceptionist.typeMessage')}
                className="flex-1 form-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : t('aiReceptionist.send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('aiReceptionist.recentRequests')}</h3>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="border border-neutral-medium rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span>{request.status}</span>
                        </span>
                        <span className="text-sm text-neutral-dark">
                          {new Date(request.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-foreground font-medium">{request.request}</p>
                      {request.guestName && (
                        <p className="text-sm text-neutral-dark">
                          {t('aiReceptionist.guest')}: {request.guestName}
                          {request.roomNumber && ` - ${t('aiReceptionist.room')} ${request.roomNumber}`}
                        </p>
                      )}
                      {request.response && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-800">{request.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.action)}
                disabled={isLoading}
                className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6 hover:shadow-md transition-shadow duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                </div>
                <p className="text-sm text-neutral-dark">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Automation Stats */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('aiReceptionist.automationStats')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-sm text-neutral-dark">{t('aiReceptionist.completedToday')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-neutral-dark">{t('aiReceptionist.pending')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-neutral-dark">{t('aiReceptionist.satisfactionRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.5min</div>
                <div className="text-sm text-neutral-dark">{t('aiReceptionist.avgResponseTime')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}