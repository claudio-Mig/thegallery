import { useState } from 'react';
import EventList from './components/EventList';
import TimeSlotSelector from './components/TimeSlotSelector';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState('events'); // events, slots, booking, confirmation
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setCurrentStep('slots');
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep('booking');
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setSelectedSlot(null);
    setCurrentStep('events');
  };

  const handleBackToSlots = () => {
    setSelectedSlot(null);
    setCurrentStep('slots');
  };

  const handleBookingComplete = (newBooking) => {
    setBooking(newBooking);
    setCurrentStep('confirmation');
  };

  const handleNewBooking = () => {
    setSelectedEvent(null);
    setSelectedSlot(null);
    setBooking(null);
    setCurrentStep('events');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'events' && (
        <EventList onSelectEvent={handleSelectEvent} />
      )}

      {currentStep === 'slots' && selectedEvent && (
        <TimeSlotSelector
          event={selectedEvent}
          onSelectSlot={handleSelectSlot}
          onBack={handleBackToEvents}
        />
      )}

      {currentStep === 'booking' && selectedEvent && selectedSlot && (
        <BookingForm
          event={selectedEvent}
          timeSlot={selectedSlot}
          onBack={handleBackToSlots}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {currentStep === 'confirmation' && booking && selectedEvent && selectedSlot && (
        <BookingConfirmation
          booking={booking}
          event={selectedEvent}
          timeSlot={selectedSlot}
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  );
}

export default App;
