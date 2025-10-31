import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const BookingConfirmation = ({ booking, event, timeSlot, onNewBooking }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Prenotazione Confermata!
            </h1>
            <p className="text-green-50 text-lg">
              Quadri Plastici di Avigliano
            </p>
          </div>

          <div className="p-8">
            {/* Booking Reference */}
            <div className="mb-8 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
              <div className="text-center">
                <p className="text-sm text-red-800 font-medium mb-2">Il tuo Codice Prenotazione</p>
                <p className="text-4xl font-bold text-red-900 tracking-wider mb-4 font-mono">
                  {booking.booking_reference}
                </p>
                <div className="flex items-center justify-center text-sm text-red-700 bg-red-200 rounded py-2 px-4 inline-flex">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <strong>Conserva questo codice per l'ingresso</strong>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Dettagli della Prenotazione
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Intestatario:</span>
                  <span className="font-semibold text-gray-800">{booking.user_name}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-800 text-sm">{booking.user_email}</span>
                </div>

                {booking.user_phone && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Telefono:</span>
                    <span className="font-semibold text-gray-800">{booking.user_phone}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b bg-red-50 -mx-4 px-4 rounded">
                  <span className="text-gray-600">Evento:</span>
                  <span className="font-semibold text-gray-800">{event.title}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-semibold text-gray-800">
                    {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: it })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Orario Ingresso:</span>
                  <span className="font-bold text-red-700 text-xl">{timeSlot.slot_time.slice(0, 5)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Numero Biglietti:</span>
                  <span className="font-semibold text-gray-800">{booking.num_tickets}</span>
                </div>

                <div className="flex justify-between items-center py-4 bg-green-50 -mx-4 px-4 rounded">
                  <span className="text-lg font-semibold text-gray-700">Totale:</span>
                  <span className="text-2xl font-bold text-green-600">
                    €{booking.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Instructions */}
            <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Istruzioni Importanti
              </h3>
              <ul className="text-sm text-amber-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>Presentarsi al <strong>punto di ritrovo nel centro storico di Avigliano</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⏰</span>
                  <span>Arrivare <strong>10 minuti prima</strong> dell'orario selezionato: <strong>{timeSlot.slot_time.slice(0, 5)}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎫</span>
                  <span>Portare con sé il <strong>codice prenotazione</strong> (anche su smartphone)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💰</span>
                  <span>Il <strong>pagamento (€{booking.total_amount.toFixed(2)})</strong> avverrà all'ingresso</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span>Riceverai una <strong>email di conferma</strong> all'indirizzo fornito</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👥</span>
                  <span>Il percorso si svolge in <strong>gruppo (max 12 persone)</strong> e dura circa 45-60 minuti</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Hai bisogno di assistenza?</strong>
              </p>
              <p className="text-sm text-gray-500">
                Contattaci per qualsiasi informazione sulla tua prenotazione
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePrint}
                className="flex-1 bg-gray-600 text-white py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Stampa Conferma
              </button>
              <button
                onClick={onNewBooking}
                className="flex-1 bg-gradient-to-r from-red-700 to-red-900 text-white py-4 px-6 rounded-lg hover:from-red-800 hover:to-red-950 transition-all font-semibold shadow-md"
              >
                Nuova Prenotazione
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center border-t">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Quadri Plastici di Avigliano</strong>
            </p>
            <p className="text-xs text-gray-500">
              Centro Storico, Avigliano (PZ) • In collaborazione con Regione Basilicata
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
