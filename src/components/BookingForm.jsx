import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { createBooking } from '../services/eventService';

const BookingForm = ({ event, timeSlot, onBack, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    num_tickets: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_tickets' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.num_tickets > timeSlot.available_spots) {
      setError(`Solo ${timeSlot.available_spots} posti disponibili per questo slot`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData = {
        event_id: event.id,
        time_slot_id: timeSlot.id,
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone: formData.user_phone,
        num_tickets: formData.num_tickets,
        total_amount: event.price * formData.num_tickets
      };

      const booking = await createBooking(bookingData);
      onBookingComplete(booking);
    } catch (err) {
      setError(err.message || 'Errore durante la creazione della prenotazione');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = event.price * formData.num_tickets;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Cambia orario
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Completa la prenotazione</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Riepilogo</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Evento:</strong> {event.title}</p>
            <p><strong>Data:</strong> {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: it })}</p>
            <p><strong>Orario:</strong> {timeSlot.slot_time.slice(0, 5)}</p>
            <p><strong>Prezzo unitario:</strong> €{event.price.toFixed(2)}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome e Cognome *
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mario Rossi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mario.rossi@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefono
            </label>
            <input
              type="tel"
              name="user_phone"
              value={formData.user_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+39 333 1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Numero di biglietti *
            </label>
            <select
              name="num_tickets"
              value={formData.num_tickets}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(Math.min(timeSlot.available_spots, 12))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'biglietto' : 'biglietti'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Posti disponibili: {timeSlot.available_spots}
            </p>
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Totale:</span>
              <span className="text-2xl font-bold text-blue-600">
                €{totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold text-white
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }
                transition-colors
              `}
            >
              {loading ? 'Elaborazione...' : 'Conferma e Procedi al Pagamento'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Cliccando "Conferma" accetti i termini e le condizioni del servizio
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
