import { supabase } from '../lib/supabase';

/**
 * Fetch all active events
 */
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'active')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (eventId) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw error;
  }

  return data;
};

/**
 * Fetch time slots for a specific event
 */
export const getTimeSlotsByEvent = async (eventId) => {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('event_id', eventId)
    .order('slot_time', { ascending: true });

  if (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }

  return data;
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  // First, check if slot has enough availability
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('available_spots')
    .eq('id', bookingData.time_slot_id)
    .single();

  if (slotError) {
    console.error('Error checking slot availability:', slotError);
    throw slotError;
  }

  if (slot.available_spots < bookingData.num_tickets) {
    throw new Error(`Solo ${slot.available_spots} posti disponibili per questo slot`);
  }

  // Generate booking reference
  const bookingReference = `BK${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        ...bookingData,
        booking_reference: bookingReference,
        payment_status: 'pending',
        status: 'confirmed'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data;
};

/**
 * Get booking by reference
 */
export const getBookingByReference = async (reference) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:events(*),
      time_slot:time_slots(*)
    `)
    .eq('booking_reference', reference)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }

  return data;
};

/**
 * Update booking payment status
 */
export const updateBookingPayment = async (bookingId, paymentData) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      payment_status: paymentData.status,
      payment_method: paymentData.method,
      payment_id: paymentData.id
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating payment:', error);
    throw error;
  }

  return data;
};
