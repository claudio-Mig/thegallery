-- Seed data for Event Booking System

-- Insert 4 sample events (modify dates as needed)
INSERT INTO events (title, description, event_date, price, status) VALUES
('Evento Serale - Giorno 1', 'Prima serata dell''evento speciale con ingresso ogni 7:30 minuti', '2024-12-15', 25.00, 'active'),
('Evento Serale - Giorno 2', 'Seconda serata dell''evento speciale con ingresso ogni 7:30 minuti', '2024-12-16', 25.00, 'active'),
('Evento Serale - Giorno 3', 'Terza serata dell''evento speciale con ingresso ogni 7:30 minuti', '2024-12-17', 25.00, 'active'),
('Evento Serale - Giorno 4', 'Quarta serata dell''evento speciale con ingresso ogni 7:30 minuti', '2024-12-18', 25.00, 'active');

-- Generate time slots for all events
DO $$
DECLARE
  event_record RECORD;
BEGIN
  FOR event_record IN SELECT id FROM events LOOP
    PERFORM generate_time_slots(event_record.id);
  END LOOP;
END $$;

-- Verify slots were created
SELECT
  e.title,
  e.event_date,
  COUNT(ts.id) as total_slots,
  SUM(ts.max_capacity) as total_capacity
FROM events e
LEFT JOIN time_slots ts ON e.id = ts.event_id
GROUP BY e.id, e.title, e.event_date
ORDER BY e.event_date;
