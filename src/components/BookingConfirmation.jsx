import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const BookingConfirmation = ({ booking, event, timeSlot, onNewBooking }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Prenotazione Confermata!
            </h1>
            <p className="text-gray-600">
              La tua prenotazione è stata registrata con successo
            </p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">Codice Prenotazione</p>
              <p className="text-2xl font-bold text-blue-600">
                {booking.booking_reference}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Conserva questo codice. Ti servirà per accedere all'evento.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Dettagli Prenotazione</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold">{booking.user_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{booking.user_email}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Evento</p>
              <p className="font-semibold text-lg">{event.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-semibold">
                  {format(new Date(event.event_date), 'd MMMM yyyy', { locale: it })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Orario Ingresso</p>
                <p className="font-semibold">{timeSlot.slot_time.slice(0, 5)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Numero Biglietti</p>
                <p className="font-semibold">{booking.num_tickets}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Totale Pagato</p>
                <p className="font-semibold text-lg text-green-600">
                  €{booking.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Informazioni Importanti</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Arriva 10 minuti prima dell'orario selezionato</li>
              <li>• Porta con te il codice di prenotazione</li>
              <li>• Riceverai una email di conferma all'indirizzo fornito</li>
              <li>• Gli ingressi sono scaglionati ogni 7:30 minuti</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Stampa Conferma
            </button>
            <button
              onClick={onNewBooking}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Nuova Prenotazione
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Hai bisogno di aiuto? Contattaci a info@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
