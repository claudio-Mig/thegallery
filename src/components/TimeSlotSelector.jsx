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
        <div className="text-xl">Caricamento slot disponibili...</div>
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
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Torna agli eventi
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-6">
          {format(new Date(event.event_date), 'EEEE d MMMM yyyy', { locale: it })}
        </p>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Info:</strong> Ogni slot ha 12 posti disponibili. Gli ingressi sono ogni 7:30 minuti.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Seleziona l'orario di ingresso</h2>

        <div className="space-y-6">
          {Object.keys(groupedSlots).sort().map(hour => (
            <div key={hour} className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3">Ore {hour}:00</h3>
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
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                          : isAvailable
                            ? 'border-gray-300 bg-white hover:border-blue-400 hover:shadow'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        }
                      `}
                    >
                      <div className="text-lg font-semibold">
                        {slot.slot_time.slice(0, 5)}
                      </div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
                        {isAvailable
                          ? `${slot.available_spots} posti`
                          : 'Esaurito'
                        }
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedSlot && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Slot selezionato:</p>
                <p className="text-lg">{selectedSlot.slot_time.slice(0, 5)}</p>
                <p className="text-sm text-gray-600">
                  {selectedSlot.available_spots} posti disponibili
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Continua
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
