'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAIConcierge, Workflow } from '../logic/useAIConcierge';

export function AIConciergePage() {
  const { t } = useTranslation('common');
  const { messages, isTyping, sendMessage, currentGuest, workflows, updateWorkflow, addWorkflowStep, removeWorkflowStep } = useAIConcierge();
  const [activeTab, setActiveTab] = useState<'chat' | 'workflows' | 'partners'>('chat');
  const [input, setInput] = useState('');
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [newStep, setNewStep] = useState({ action: '', description: '' });
  const [partners, setPartners] = useState([
    {
      id: '1',
      name: 'Local Restaurant',
      category: 'Dining',
      description: 'Authentic local cuisine with fresh ingredients',
      website: 'https://localrestaurant.com',
      openingHours: 'Monday-Friday: 11AM-10PM\nSaturday-Sunday: 12PM-11PM\nClosed on holidays',
      contact: '+1-555-123-4567',
      affiliateLink: 'https://example.com/restaurant?ref=hotel',
      commission: 10,
      recommendationNotes: 'Recommend to guests interested in local dining, especially families or couples looking for authentic experiences.'
    },
    {
      id: '2',
      name: 'Tour Guide Service',
      category: 'Activities',
      description: 'Professional guided tours of the area',
      website: 'https://tourguide.com',
      openingHours: 'Monday-Saturday: 9AM-6PM\nSunday: 10AM-4PM\nClosed in winter',
      contact: '+1-555-987-6543',
      affiliateLink: 'https://example.com/tours?ref=hotel',
      commission: 15,
      recommendationNotes: 'Suggest to guests planning outdoor activities, hiking, or sightseeing tours.'
    },
  ]);
  const [newPartner, setNewPartner] = useState({
    name: '',
    category: '',
    description: '',
    website: '',
    openingHours: '',
    contact: '',
    affiliateLink: '',
    commission: 0,
    recommendationNotes: ''
  });
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });
  const [recommendationMode, setRecommendationMode] = useState(false);
  const [suggestedPartners, setSuggestedPartners] = useState<any[]>([]);
  const [pendingReservations, setPendingReservations] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input.trim();
      sendMessage(userMessage);

      // Check if it's a recommendation request
      if (userMessage.toLowerCase().includes('recommend') || userMessage.toLowerCase().includes('suggest') || userMessage.toLowerCase().includes('where') || userMessage.toLowerCase().includes('what')) {
        // Mock AI response with suggestions
        setTimeout(() => {
          const relevantPartners = partners.filter(p =>
            userMessage.toLowerCase().includes(p.category.toLowerCase()) ||
            p.recommendationNotes.toLowerCase().includes(userMessage.toLowerCase())
          ).slice(0, 3); // Suggest up to 3

          if (relevantPartners.length > 0) {
            setSuggestedPartners(relevantPartners);
            setRecommendationMode(true);
            sendMessage(`Based on your request, I recommend these partners:\n${relevantPartners.map(p => `- ${p.name}: ${p.description}`).join('\n')}\n\nWould you like to make a reservation with any of these?`);
          } else {
            sendMessage(t('aiConcierge.noSpecificRecommendations'));
          }
        }, 1000);
      }

      setInput('');
    }
  };

  const quickActions = [
    t('aiConcierge.checkMeIn'),
    t('aiConcierge.wifiPassword'),
    t('aiConcierge.roomAccessCode'),
    t('aiConcierge.restaurantHours'),
    t('aiConcierge.parkingInfo'),
  ];

  const handleAddStep = () => {
    if (editingWorkflow && newStep.action && newStep.description) {
      const step = {
        id: Date.now().toString(),
        ...newStep,
      };
      addWorkflowStep(editingWorkflow.id, step);
      setNewStep({ action: '', description: '' });
    }
  };

  const handleRemoveStep = (workflowId: string, stepId: string) => {
    removeWorkflowStep(workflowId, stepId);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 xl:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('aiConcierge.title')}</h1>
        <p className="text-neutral-dark">{t('aiConcierge.intelligentAssistant')}</p>
      </div>

      <div className="flex bg-neutral-light rounded-lg p-1 border border-neutral-medium">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === 'chat' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'}`}
        >
          {t('aiConcierge.chat')}
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === 'workflows' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'}`}
        >
          {t('aiConcierge.workflows')}
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${activeTab === 'partners' ? 'bg-white shadow-sm text-primary border border-neutral-medium' : 'text-neutral-dark hover:text-primary'}`}
        >
          {t('aiConcierge.partners')}
        </button>
      </div>

      {activeTab === 'chat' && (
        <div>
          {currentGuest && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-primary mb-2">{t('aiConcierge.currentGuest')}</h2>
              <p className="text-foreground"><strong>{t('aiConcierge.name')}:</strong> {currentGuest.name}</p>
              <p className="text-foreground"><strong>{t('aiConcierge.room')}:</strong> {currentGuest.room}</p>
              <p className="text-foreground"><strong>{t('aiConcierge.accessCode')}:</strong> {currentGuest.accessCode}</p>
              <p className="text-foreground"><strong>{t('aiConcierge.wifi')}:</strong> {currentGuest.wifiPassword}</p>
            </div>
          )}

          <div className="flex-1 bg-neutral-light rounded-lg p-4 overflow-y-auto mb-4 border border-neutral-medium">
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white shadow-sm border border-neutral-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white shadow-sm border border-neutral-medium">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neutral-dark rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {recommendationMode && suggestedPartners.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-primary mb-3">{t('aiConcierge.partnerRecommendations')}</h3>
              <div className="space-y-3">
                {suggestedPartners.map((partner) => (
                  <div key={partner.id} className="bg-white p-3 rounded-lg shadow-sm border border-neutral-medium h-[200px] flex flex-col">
                    <h4 className="font-semibold text-foreground">{partner.name}</h4>
                    <p className="text-sm text-neutral-dark mb-2">{partner.description}</p>
                     <p className="text-sm text-neutral-dark mb-2"><strong>{t('aiConcierge.hours')}:</strong> {partner.openingHours.replace('\n', ', ')}</p>
                     <p className="text-sm text-neutral-dark mb-3"><strong>{t('aiConcierge.contact')}:</strong> {partner.contact}</p>
                     <button
                       onClick={() => {
                         // Simulate sending reservation request
                         setPendingReservations([...pendingReservations, { ...partner, requestedAt: new Date() }]);
                         sendMessage(`Great! I've sent a reservation request to ${partner.name}. I'll confirm once they respond.`);
                         setRecommendationMode(false);
                         setSuggestedPartners([]);
                       }}
                       className="btn-success px-4 py-2 text-sm mt-auto"
                     >
{t('aiConcierge.requestReservation')}
                     </button>
                  </div>
                ))}
              </div>
                <button
                  onClick={() => {
                    setRecommendationMode(false);
                    setSuggestedPartners([]);
                    sendMessage(t('aiConcierge.noProblemAnythingElse'));
                  }}
                  className="mt-3 bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                >
                 {t('aiConcierge.cancel')}
              </button>
            </div>
          )}

           <div className="mb-4">
             <p className="text-sm text-neutral-dark mb-2">{t('aiConcierge.quickActions')}:</p>
             <div className="flex flex-wrap gap-2">
               {quickActions.map((action) => (
                 <button
                   key={action}
                   onClick={() => sendMessage(action)}
                   className="bg-neutral-light hover:bg-neutral-medium text-neutral-dark px-3 py-1 rounded-full text-sm transition-all duration-200 border border-neutral-medium"
                 >
                   {action}
                 </button>
               ))}
             </div>
           </div>

           <form onSubmit={handleSubmit} className="flex gap-2">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={t('aiConcierge.typeMessage')}
               className="flex-1 border border-neutral-medium rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
             />
             <button
               type="submit"
               className="btn-primary px-6 py-3 font-medium"
             >
{t('aiConcierge.send')}
            </button>
            </form>
        </div>
      )}

        {pendingReservations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">{t('aiConcierge.pendingReservations')}</h3>
            <div className="space-y-2">
              {pendingReservations.map((res, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-neutral-medium flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">{res.name}</p>
                    <p className="text-sm text-neutral-dark">Requested at {res.requestedAt.toLocaleTimeString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      // Simulate partner confirmation
                      setPendingReservations(pendingReservations.filter((_, i) => i !== index));
                      sendMessage(`Great news! ${res.name} has confirmed your reservation. Enjoy your experience!`);
                    }}
                    className="btn-success px-3 py-1 text-sm"
                  >
{t('aiConcierge.confirmSimulate')}
                  </button>
                </div>
              ))}
            </div>
           </div>
         )}

        {activeTab === 'workflows' && (
         <div className="flex-1 overflow-y-auto">
           <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiConcierge.workflowConfiguration')}</h2>
           <p className="text-neutral-dark mb-6">{t('aiConcierge.customizeAutomatedProcesses')}</p>

           <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-medium">
             <h3 className="font-semibold mb-4 text-foreground">{t('aiConcierge.createNewWorkflow')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <input
                 type="text"
                 placeholder={t('aiConcierge.workflowName')}
                 value={newWorkflow.name}
                 onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="text"
                 placeholder={t('aiConcierge.description')}
                 value={newWorkflow.description}
                 onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
            </div>
              <button
                onClick={() => {
                  if (newWorkflow.name) {
                    const newWorkflowObj = {
                      id: Date.now().toString(),
                      name: newWorkflow.name,
                      description: newWorkflow.description,
                      steps: []
                    };
                    updateWorkflow(newWorkflowObj.id, newWorkflowObj);
                    setNewWorkflow({ name: '', description: '' });
                  }
                }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t('aiConcierge.createWorkflow')}
            </button>
          </div>

          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-neutral-light rounded-lg p-4 mb-4 border border-neutral-medium">
              <h3 className="text-lg font-semibold mb-3 text-foreground">{workflow.name}</h3>
              <div className="space-y-2">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-neutral-medium">
                    <div className="flex items-center">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{step.action}</p>
                        <p className="text-sm text-neutral-dark">{step.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStep(workflow.id, step.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {editingWorkflow?.id === workflow.id && (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-neutral-medium">
                   <h4 className="font-semibold mb-2 text-foreground">{t('aiConcierge.addNewStep')}</h4>
                  <input
                    type="text"
                     placeholder={t('aiConcierge.action')}
                    value={newStep.action}
                    onChange={(e) => setNewStep({ ...newStep, action: e.target.value })}
                    className="border border-neutral-medium rounded-lg p-2 mr-2 mb-2 w-full bg-white"
                  />
                  <input
                    type="text"
                    placeholder={t('aiConcierge.description')}
                    value={newStep.description}
                    onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    className="border border-neutral-medium rounded-lg p-2 mr-2 mb-2 w-full bg-white"
                  />
                  <button
                    onClick={handleAddStep}
                    className="btn-primary px-4 py-2"
                  >
                     {t('aiConcierge.addStep')}
                  </button>
                </div>
              )}
               <button
                 onClick={() => setEditingWorkflow(workflow)}
                 className="mt-3 bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
               >
                 {t('aiConcierge.editSteps')}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-foreground">{t('aiConcierge.partnersManagement')}</h2>
          <p className="text-neutral-dark mb-6">{t('aiConcierge.partnerManagementDesc')}</p>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-medium">
            <h3 className="font-semibold mb-4 text-foreground">{t('aiConcierge.addNewPartner')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <input
                 type="text"
                  placeholder={t('aiConcierge.partnerName')}
                 value={newPartner.name}
                 onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="text"
                  placeholder={t('aiConcierge.category')}
                 value={newPartner.category}
                 onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="text"
                 placeholder={t('aiConcierge.description')}
                 value={newPartner.description}
                 onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="url"
                  placeholder={t('aiConcierge.website')}
                 value={newPartner.website}
                 onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <textarea
                  placeholder={t('aiConcierge.openingHoursPlaceholder')}
                 value={newPartner.openingHours}
                 onChange={(e) => setNewPartner({ ...newPartner, openingHours: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 h-20 resize-none bg-white"
                 rows={3}
               />
               <input
                 type="text"
                  placeholder={t('aiConcierge.contact')}
                 value={newPartner.contact}
                 onChange={(e) => setNewPartner({ ...newPartner, contact: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="url"
                  placeholder={t('aiConcierge.affiliateLink')}
                 value={newPartner.affiliateLink}
                 onChange={(e) => setNewPartner({ ...newPartner, affiliateLink: e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
               <input
                 type="number"
                  placeholder={t('aiConcierge.commissionPlaceholder')}
                 value={newPartner.commission}
                 onChange={(e) => setNewPartner({ ...newPartner, commission: +e.target.value })}
                 className="border border-neutral-medium rounded-lg p-2 bg-white"
               />
            </div>
             <textarea
                placeholder={t('aiConcierge.recommendationNotesPlaceholder')}
               value={newPartner.recommendationNotes}
               onChange={(e) => setNewPartner({ ...newPartner, recommendationNotes: e.target.value })}
               className="border border-neutral-medium rounded-lg p-2 w-full h-20 resize-none bg-white"
               rows={3}
             />
             <button
               onClick={() => {
                 if (newPartner.name && newPartner.affiliateLink) {
                   setPartners([...partners, { ...newPartner, id: Date.now().toString() }]);
                   setNewPartner({ name: '', category: '', description: '', website: '', openingHours: '', contact: '', affiliateLink: '', commission: 0, recommendationNotes: '' });
                 }
               }}
               className="btn-success px-4 py-2"
             >
               {t('aiConcierge.addPartner')}
            </button>
          </div>

          <div className="space-y-4">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white p-4 rounded-lg shadow-sm border border-neutral-medium">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{partner.name}</h4>
                    <p className="text-sm text-neutral-dark mb-2">{partner.category}</p>
                    <p className="text-sm text-neutral-dark mb-1">{partner.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                       <p><strong>{t('aiConcierge.website')}:</strong> <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">{partner.website}</a></p>
                       <div><strong>{t('aiConcierge.hours')}:</strong><br /><span style={{ whiteSpace: 'pre-line' }}>{partner.openingHours}</span></div>
                       <p><strong>{t('aiConcierge.contact')}:</strong> {partner.contact}</p>
                       <p><strong>{t('aiConcierge.commission')}:</strong> {partner.commission}%</p>
                    </div>
                     <p className="text-sm text-primary mt-2">
                       <strong>{t('aiConcierge.affiliateLink')}:</strong> <a href={partner.affiliateLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark">
                         {partner.affiliateLink}
                       </a>
                     </p>
                     {partner.recommendationNotes && (
                       <p className="text-sm text-neutral-dark mt-1">
                         <strong>{t('aiConcierge.aiNotes')}:</strong> {partner.recommendationNotes}
                       </p>
                     )}
                  </div>
                  <div className="ml-4">
                    <button className="text-red-500 hover:text-red-700">{t('aiConcierge.remove')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}