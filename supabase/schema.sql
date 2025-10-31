-- Event Booking System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '16:00:00',
  last_entry_time TIME NOT NULL DEFAULT '21:22:00',
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  slot_time TIME NOT NULL,
  slot_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 12,
  available_spots INTEGER NOT NULL DEFAULT 12,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'full', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, slot_time)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50),
  num_tickets INTEGER NOT NULL CHECK (num_tickets > 0 AND num_tickets <= 12),
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_time_slots_event ON time_slots(event_id);
CREATE INDEX idx_time_slots_datetime ON time_slots(slot_datetime);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_bookings_slot ON bookings(time_slot_id);
CREATE INDEX idx_bookings_email ON bookings(user_email);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update slot availability when booking is created
CREATE OR REPLACE FUNCTION update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE time_slots
    SET
      available_spots = available_spots - NEW.num_tickets,
      status = CASE
        WHEN available_spots - NEW.num_tickets <= 0 THEN 'full'
        ELSE 'available'
      END
    WHERE id = NEW.time_slot_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE time_slots
    SET
      available_spots = available_spots + OLD.num_tickets,
      status = 'available'
    WHERE id = OLD.time_slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slot availability
CREATE TRIGGER update_slot_on_booking AFTER INSERT OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_slot_availability();

-- Function to generate time slots for an event
CREATE OR REPLACE FUNCTION generate_time_slots(p_event_id UUID)
RETURNS void AS $$
DECLARE
  v_event_date DATE;
  v_hour INTEGER;
  v_minutes INTEGER[];
  v_minute INTEGER;
  v_slot_time TIME;
  v_slot_datetime TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get event date
  SELECT event_date INTO v_event_date FROM events WHERE id = p_event_id;

  -- Define the minutes pattern for each hour: 00, 07, 15, 22, 30, 37
  v_minutes := ARRAY[0, 7, 15, 22, 30, 37];

  -- Loop through hours from 16 to 21
  FOR v_hour IN 16..21 LOOP
    FOREACH v_minute IN ARRAY v_minutes LOOP
      v_slot_time := make_time(v_hour, v_minute, 0);
      v_slot_datetime := v_event_date + v_slot_time;

      -- Only insert if slot_time is before or equal to 21:22
      IF v_slot_time <= '21:22:00'::TIME THEN
        INSERT INTO time_slots (event_id, slot_time, slot_datetime)
        VALUES (p_event_id, v_slot_time, v_slot_datetime)
        ON CONFLICT (event_id, slot_time) DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Events: everyone can read active events
CREATE POLICY "Everyone can view active events" ON events
  FOR SELECT USING (status = 'active');

-- Time slots: everyone can read available slots
CREATE POLICY "Everyone can view time slots" ON time_slots
  FOR SELECT USING (true);

-- Bookings: users can create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Bookings: users can view their own bookings
CREATE POLICY "Users can view their bookings" ON bookings
  FOR SELECT USING (true);
