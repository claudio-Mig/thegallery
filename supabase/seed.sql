-- Seed data for Quadri Plastici di Avigliano - Event Booking System

-- Insert 4 events for Quadri Plastici 2024/2025
INSERT INTO events (title, description, event_date, price, status) VALUES
(
  'Quadri Plastici - Prima Serata',
  'Tradizionale rappresentazione vivente del Presepe nel centro storico di Avigliano. Un viaggio emozionante tra le caratteristiche strade e i vicoli del borgo antico, dove prenderanno vita scene della Natività lucana. Ingressi contingentati ogni 7:30 minuti per garantire la migliore esperienza a tutti i visitatori.',
  '2024-12-15',
  5.00,
  'active'
),
(
  'Quadri Plastici - Seconda Serata',
  'Seconda rappresentazione dei celebri Quadri Plastici di Avigliano. Ammira le scene del presepe vivente ambientate negli angoli più suggestivi del centro storico, con figuranti in costume d''epoca che ricreano l''atmosfera della Natività. Un''esperienza unica della tradizione lucana.',
  '2024-12-22',
  5.00,
  'active'
),
(
  'Quadri Plastici - Terza Serata',
  'Terzo appuntamento con i Quadri Plastici nel cuore del borgo antico di Avigliano. Lasciati trasportare dalla magia del Presepe vivente attraverso un percorso guidato tra vicoli illuminati e scene sacre rappresentate da figuranti locali. Tradizione e spiritualità si fondono in un''esperienza indimenticabile.',
  '2024-12-29',
  5.00,
  'active'
),
(
  'Quadri Plastici - Quarta Serata',
  'Ultima rappresentazione dei Quadri Plastici di Avigliano. Concludi le festività natalizie con una visita al Presepe vivente più suggestivo della Basilicata. Percorri le strade del centro storico e scopri le scene della Natività ricreate con passione dalla comunità aviglianese. Un evento che unisce fede, cultura e tradizione.',
  '2025-01-05',
  5.00,
  'active'
);

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
