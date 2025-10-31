import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { getTimeSlotsByEvent } from '../services/eventService';

const TimeSlotSelector = ({ event, onSelectSlot, onBack }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    loadTimeSlots();
  }, [event.id]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await getTimeSlotsByEvent(event.id);
      setSlots(data);
    } catch (err) {
      setError('Errore nel caricamento degli slot');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByHour = () => {
    const grouped = {};
    slots.forEach(slot => {
      const hour = slot.slot_time.slice(0, 2);
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(slot);
    });
    return grouped;
  };

  const handleSlotClick = (slot) => {
    if (slot.status !== 'available' || slot.available_spots === 0) {
      return;
    }
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (selectedSlot) {
      onSelectSlot(selectedSlot);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Caricamento orari disponibili...</div>
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

  const groupedSlots = groupSlotsByHour();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-red-700 hover:text-red-900 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Torna agli eventi
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-red-100">
            {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: it })}
          </p>
        </div>

        <div className="p-6">
          {/* Info Banner */}
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <div className="flex">
              <svg className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">
                  <strong>Informazioni importanti:</strong>
                </p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Ogni gruppo è composto da massimo 12 persone</li>
                  <li>• Gli ingressi sono scaglionati ogni 7:30 minuti</li>
                  <li>• Presentarsi 10 minuti prima dell'orario selezionato</li>
                  <li>• Il percorso dura circa 45-60 minuti</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Seleziona l'orario di ingresso
          </h2>

          {/* Slots Grid */}
          <div className="space-y-6">
            {Object.keys(groupedSlots).sort().map(hour => (
              <div key={hour} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ore {hour}:00
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {groupedSlots[hour].map(slot => {
                    const isAvailable = slot.status === 'available' && slot.available_spots > 0;
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        disabled={!isAvailable}
                        className={`
                          p-3 rounded-lg border-2 transition-all
                          ${isSelected
                            ? 'border-red-700 bg-red-700 text-white shadow-lg scale-105'
                            : isAvailable
                              ? 'border-gray-300 bg-white hover:border-red-400 hover:shadow hover:scale-105'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        <div className="text-lg font-semibold">
                          {slot.slot_time.slice(0, 5)}
                        </div>
                        <div className={`text-xs mt-1 ${isSelected ? 'text-red-100' : 'text-gray-600'}`}>
                          {isAvailable
                            ? `${slot.available_spots} ${slot.available_spots === 1 ? 'posto' : 'posti'}`
                            : 'Completo'
                          }
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Slot Confirmation */}
          {selectedSlot && (
            <div className="mt-8 p-6 bg-green-50 border-2 border-green-500 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-2">
                    ✓ Orario selezionato
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedSlot.slot_time.slice(0, 5)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedSlot.available_spots} {selectedSlot.available_spots === 1 ? 'posto disponibile' : 'posti disponibili'}
                  </p>
                </div>
                <button
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md"
                >
                  Procedi con la prenotazione
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 font-medium">Legenda:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded mr-2"></div>
                <span className="text-gray-600">Disponibile</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-red-700 bg-red-700 rounded mr-2"></div>
                <span className="text-gray-600">Selezionato</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-200 bg-gray-100 rounded mr-2"></div>
                <span className="text-gray-600">Completo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
