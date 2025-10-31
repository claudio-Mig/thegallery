import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { getEvents } from '../services/eventService';

const EventList = ({ onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError('Errore nel caricamento degli eventi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Caricamento eventi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Quadri Plastici di Avigliano
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Tradizionale Presepe Vivente nel Centro Storico
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Prenota il tuo ingresso per vivere la magia del Presepe vivente più suggestivo della Basilicata.
          Ingressi contingentati ogni 7:30 minuti per garantire la migliore esperienza.
        </p>
      </div>

      {/* Important Info Banner */}
      <div className="max-w-4xl mx-auto mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Importante:</strong> I posti sono limitati. Si consiglia la prenotazione anticipata.
              Presentarsi 10 minuti prima dell'orario selezionato presso il punto di ritrovo nel centro storico.
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-200"
            onClick={() => onSelectEvent(event)}
          >
            <div className="bg-gradient-to-r from-red-700 to-red-900 p-4">
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: it })}
                  </span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">
                    Ingressi dalle {event.start_time.slice(0, 5)} alle {event.last_entry_time.slice(0, 5)}
                  </span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-700">
                    12 persone per gruppo
                  </span>
                </div>

                <div className="flex items-center pt-2 border-t">
                  <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-800 font-bold text-lg">
                    €{event.price.toFixed(2)} per persona
                  </span>
                </div>
              </div>

              <button className="mt-6 w-full bg-gradient-to-r from-red-700 to-red-900 text-white py-3 px-4 rounded-lg hover:from-red-800 hover:to-red-950 transition-all font-semibold shadow-md">
                Prenota il tuo ingresso
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto mt-12 text-center text-gray-600 text-sm">
        <p className="mb-2">
          <strong>Avigliano (PZ)</strong> - Centro Storico
        </p>
        <p>
          Un evento della tradizione lucana organizzato in collaborazione con la Regione Basilicata
        </p>
      </div>
    </div>
  );
};

export default EventList;
