// modules/ai-receptionist/logic/useAIReceptionist.ts
import { supabase } from '../../../core/config/supabaseClient';

export const useAIReceptionist = () => {
  const handleCheckIn = async (reservationId: string) => {
    // Logic for check-in process
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'checked_in' })
        .eq('id', reservationId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleCheckOut = async (reservationId: string) => {
    // Logic for check-out process
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'checked_out' })
        .eq('id', reservationId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const answerQuestion = async (question: string) => {
    // Enhanced AI logic for answering guest questions
    // This could be enhanced with actual AI integration
    const responses: { [key: string]: string } = {
      'wifi': 'Our WiFi password is HotelGuest2024. Network name: HotelGuest_Premium.',
      'password': 'The WiFi password is HotelGuest2024. You can also find this information in your room welcome packet.',
      'breakfast': 'Breakfast is served from 7:00 AM to 10:00 AM in main dining room. Room service is available 24/7.',
      'food': 'Room service is available 24/7. You can order through your room tablet or by calling extension 0.',
      'checkout': 'Check-out time is 11:00 AM. Late check-out is available until 2:00 PM for an additional fee.',
      'check out': 'Check-out time is 11:00 AM. Late check-out is available until 2:00 PM for an additional fee.',
      'parking': 'Free parking is available in our underground garage. Please take your room key for access.',
      'pool': 'The swimming pool is open from 6:00 AM to 10:00 PM. Towels are provided at the pool area.',
      'swim': 'The swimming pool is open from 6:00 AM to 10:00 PM. Towels are provided at the pool area.',
      'gym': 'The fitness center is open 24/7 for hotel guests. Your room key provides access.',
      'fitness': 'The fitness center is open 24/7 for hotel guests. Your room key provides access.',
      'taxi': 'I can call a taxi for you right away. Would you like me to arrange one?',
      'transport': 'I can arrange transportation for you. We have taxi service and airport shuttle available.',
      'cleaning': 'Housekeeping can be requested at any time. Extra towels and amenities are available upon request.',
      'housekeeping': 'Housekeeping can be requested at any time. Extra towels and amenities are available upon request.',
      'maintenance': 'Our maintenance team is available 24/7 for any room issues or repairs.',
      'repair': 'Our maintenance team is available 24/7 for any room issues or repairs.',
    };

    const lowerQuestion = question.toLowerCase();
    
    // Check for exact matches first
    for (const key in responses) {
      if (lowerQuestion.includes(key)) {
        return responses[key];
      }
    }

    // Check for more complex patterns
    if (lowerQuestion.includes('what time') && (lowerQuestion.includes('breakfast') || lowerQuestion.includes('food'))) {
      return 'Breakfast is served from 7:00 AM to 10:00 AM in the main dining room.';
    }
    
    if (lowerQuestion.includes('late check') || lowerQuestion.includes('extend')) {
      return 'Late check-out is available until 2:00 PM for an additional fee. Please contact the front desk to arrange.';
    }

    if (lowerQuestion.includes('airport') || lowerQuestion.includes('shuttle')) {
      return 'Airport shuttle is available every hour from 5:00 AM to 11:00 PM. The pickup point is at the main entrance.';
    }

    // Log unanswered questions for improvement
    try {
      await supabase
        .from('ai_receptionist_logs')
        .insert({
          question,
          response: 'unanswered',
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log question:', error);
    }

    return 'I understand your request. Let me connect you with the appropriate service or you can contact the front desk for immediate assistance.';
  };

  const assignRoom = async (reservationId: string, preferences?: { type?: string }) => {
    try {
      // Get available rooms
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available');

      if (roomsError) throw roomsError;

      // Filter by type if specified
      let availableRooms = rooms;
      if (preferences?.type) {
        availableRooms = rooms.filter(room => room.type === preferences.type);
      }

      if (availableRooms.length === 0) {
        return { success: false, error: 'No available rooms matching preferences' };
      }

      // Assign first available room
      const assignedRoom = availableRooms[0];

      // Update reservation
      const { error } = await supabase
        .from('reservations')
        .update({ room_number: assignedRoom.number })
        .eq('id', reservationId);

      if (error) throw error;

      return { success: true, room: assignedRoom };
    } catch (error) {
      return { success: false, error };
    }
  };

  const requestHousekeeping = async (roomNumber: string, request: string) => {
    try {
      const { data, error } = await supabase
        .from('housekeeping_requests')
        .insert({
          room_number: roomNumber,
          request,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const callTaxi = async (guestName: string, roomNumber: string, destination?: string) => {
    try {
      const { data, error } = await supabase
        .from('taxi_requests')
        .insert({
          guest_name: guestName,
          room_number: roomNumber,
          destination,
          status: 'requested',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const requestRoomService = async (roomNumber: string, order: string) => {
    try {
      const { data, error } = await supabase
        .from('room_service_orders')
        .insert({
          room_number: roomNumber,
          order_details: order,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const requestMaintenance = async (roomNumber: string, issue: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          room_number: roomNumber,
          issue,
          priority,
          status: 'open',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const sendHotelInformation = async (guestEmail?: string, roomNumber?: string) => {
    try {
      const { data, error } = await supabase
        .from('information_requests')
        .insert({
          guest_email: guestEmail,
          room_number: roomNumber,
          status: 'sent',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };

  const executeWorkflow = async (action: string, params: Record<string, unknown>): Promise<unknown> => {
    // Execute predefined workflows based on action
    switch (action) {
      case 'check_in':
        return await handleCheckIn(params.reservationId as string);
      case 'check_out':
        return await handleCheckOut(params.reservationId as string);
      case 'answer':
        return { success: true, data: await answerQuestion(params.question as string) };
      case 'assign_room':
        return await assignRoom(params.reservationId as string, params.preferences as { type?: string } | undefined);
      case 'auto_checkin':
        return await handleCheckIn(params.reservationId as string);
      case 'housekeeping':
        return await requestHousekeeping((params.roomNumber as string) || 'TBD', (params.request as string) || 'General housekeeping request');
      case 'taxi':
        return await callTaxi((params.guestName as string) || 'Guest', (params.roomNumber as string) || 'TBD', params.destination as string);
      case 'room_service':
        return await requestRoomService((params.roomNumber as string) || 'TBD', (params.order as string) || 'Room service request');
      case 'maintenance':
        return await requestMaintenance((params.roomNumber as string) || 'TBD', (params.issue as string) || 'Maintenance request', params.priority as 'low' | 'medium' | 'high' | undefined);
      case 'information':
        return await sendHotelInformation(params.guestEmail as string, params.roomNumber as string);
      default:
        return { success: false, error: 'Unknown action' };
    }
  };

  return {
    handleCheckIn,
    handleCheckOut,
    answerQuestion,
    assignRoom,
    requestHousekeeping,
    callTaxi,
    requestRoomService,
    requestMaintenance,
    sendHotelInformation,
    executeWorkflow,
  };
};