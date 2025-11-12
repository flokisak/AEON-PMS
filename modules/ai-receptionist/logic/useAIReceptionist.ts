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
    // Basic AI logic for answering guest questions
    // This could be enhanced with actual AI integration
    const responses: { [key: string]: string } = {
      'wifi': 'Our WiFi password is HotelGuest2024',
      'breakfast': 'Breakfast is served from 7AM to 10AM in the main dining room',
      'checkout': 'Checkout time is 11AM',
      'parking': 'Free parking is available in our underground garage',
    };

    const lowerQuestion = question.toLowerCase();
    for (const key in responses) {
      if (lowerQuestion.includes(key)) {
        return responses[key];
      }
    }

    return 'I apologize, but I need more information to help you. Please contact the front desk.';
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

      // Assign the first available room
      const assignedRoom = availableRooms[0];

      // Update reservation
      const { data, error } = await supabase
        .from('reservations')
        .update({ room_number: assignedRoom.number })
        .eq('id', reservationId);

      if (error) throw error;

      return { success: true, room: assignedRoom };
    } catch (error) {
      return { success: false, error };
    }
  };

  const executeWorkflow = async (action: string, params: any): Promise<any> => {
    // Execute predefined workflows based on action
    switch (action) {
      case 'check_in':
        return await handleCheckIn(params.reservationId);
      case 'check_out':
        return await handleCheckOut(params.reservationId);
      case 'answer':
        return await answerQuestion(params.question);
      case 'assign_room':
        return await assignRoom(params.reservationId, params.preferences);
      default:
        return { success: false, error: 'Unknown action' };
    }
  };

  return {
    handleCheckIn,
    handleCheckOut,
    answerQuestion,
    assignRoom,
    executeWorkflow,
  };
};