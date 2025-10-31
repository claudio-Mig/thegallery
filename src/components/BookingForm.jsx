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
      setError(`Solo ${timeSlot.available_spots} ${timeSlot.available_spots === 1 ? 'posto disponibile' : 'posti disponibili'} per questo orario`);
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
        className="mb-6 flex items-center text-red-700 hover:text-red-900 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Cambia orario
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 p-6">
          <h1 className="text-3xl font-bold text-white">Completa la Prenotazione</h1>
        </div>

        <div className="p-6">
          {/* Summary */}
          <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-700">
            <h2 className="font-semibold mb-3 text-red-900">Riepilogo Prenotazione</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Evento:</span>
                <span className="font-medium text-gray-800">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium text-gray-800">
                  {format(new Date(event.event_date), 'd MMMM yyyy', { locale: it })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Orario ingresso:</span>
                <span className="font-medium text-gray-800">{timeSlot.slot_time.slice(0, 5)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-red-200">
                <span className="text-gray-600">Prezzo unitario:</span>
                <span className="font-medium text-gray-800">€{event.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Nome e Cognome *
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="mario.rossi@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Riceverai la conferma della prenotazione a questo indirizzo
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Telefono *
              </label>
              <input
                type="tel"
                name="user_phone"
                value={formData.user_phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="+39 333 1234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Numero di biglietti *
              </label>
              <select
                name="num_tickets"
                value={formData.num_tickets}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              >
                {[...Array(Math.min(timeSlot.available_spots, 12))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'biglietto' : 'biglietti'} - €{((i + 1) * event.price).toFixed(2)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Posti disponibili per questo orario: <strong>{timeSlot.available_spots}</strong>
              </p>
            </div>

            {/* Important Info */}
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> Presentarsi al punto di ritrovo nel centro storico di Avigliano
                <strong> 10 minuti prima</strong> dell'orario selezionato con il codice di prenotazione.
              </p>
            </div>

            {/* Total and Submit */}
            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-700">Totale da pagare:</span>
                <span className="text-3xl font-bold text-green-600">
                  €{totalAmount.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold text-white text-lg
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  }
                  transition-all shadow-lg
                `}
              >
                {loading ? 'Elaborazione in corso...' : 'Conferma Prenotazione'}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Il pagamento avverrà all'ingresso dell'evento
              </p>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Cliccando "Conferma Prenotazione" accetti i termini e le condizioni del servizio
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
