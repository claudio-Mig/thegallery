# Sistema di Prenotazione Eventi - The Gallery

Sistema completo di prenotazione per eventi con slot temporali programmati. Costruito con React, Vite, Supabase e Tailwind CSS.

## 📋 Caratteristiche

- **4 Eventi su 4 Giornate**: Gestione di eventi distribuiti su giornate diverse
- **Slot Temporali Programmati**: Ingressi ogni 7:30 minuti dalle 16:00 alle 21:22
- **12 Posti per Slot**: Ogni slot temporale può ospitare fino a 12 persone
- **Prenotazione in Tempo Reale**: Verifica immediata della disponibilità
- **Sistema di Pagamento**: Integrazione pronta per pagamenti online
- **Interfaccia Responsive**: Ottimizzata per desktop e mobile
- **Gestione Codici Prenotazione**: Sistema automatico di generazione codici univoci

## 🏗️ Architettura

### Frontend
- **React 18** con Vite per prestazioni ottimali
- **Tailwind CSS** per uno styling moderno e responsive
- **date-fns** per la gestione delle date

### Backend
- **Supabase** per database PostgreSQL, autenticazione e API real-time
- **Row Level Security (RLS)** per la sicurezza dei dati
- Funzioni database per logica business server-side

## 🚀 Setup Iniziale

### 1. Prerequisiti

- Node.js 18+ e npm installati
- Account Supabase (gratuito su [supabase.com](https://supabase.com))

### 2. Installazione Dipendenze

```bash
npm install
```

### 3. Configurazione Supabase

#### 3.1 Crea un Progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
2. Annota l'URL del progetto e la chiave API (anon key)

#### 3.2 Configura il Database

1. Vai nella sezione **SQL Editor** del tuo progetto Supabase
2. Esegui il contenuto del file `supabase/schema.sql` per creare le tabelle
3. Esegui il contenuto del file `supabase/seed.sql` per popolare i dati di esempio

**Importante**: Modifica le date nel file `seed.sql` prima di eseguirlo:

```sql
-- Cambia queste date con quelle dei tuoi eventi
INSERT INTO events (title, description, event_date, price, status) VALUES
('Evento Serale - Giorno 1', 'Prima serata...', '2024-12-15', 25.00, 'active'),
-- ... altre date
```

### 4. Configurazione Variabili d'Ambiente

1. Copia il file `.env.example` in `.env`:

```bash
cp .env.example .env
```

2. Modifica `.env` con le tue credenziali Supabase:

```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-anon
```

### 5. Avvia il Server di Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 📊 Schema Database

### Tabelle Principali

#### `events`
- Gestisce le informazioni degli eventi
- Campi: id, title, description, event_date, start_time, last_entry_time, price, status

#### `time_slots`
- Slot temporali per ogni evento
- Generati automaticamente con la funzione `generate_time_slots()`
- Campi: id, event_id, slot_time, max_capacity, available_spots, status

#### `bookings`
- Prenotazioni degli utenti
- Campi: id, event_id, time_slot_id, user_email, user_name, num_tickets, total_amount, booking_reference, payment_status

## 🕐 Logica Slot Temporali

Gli slot seguono questo pattern per ogni ora dalle 16:00 alle 21:00:
- **:00** - Primo slot (es. 16:00)
- **:07** - Secondo slot (es. 16:07)
- **:15** - Terzo slot (es. 16:15)
- **:22** - Quarto slot (es. 16:22)
- **:30** - Quinto slot (es. 16:30)
- **:37** - Sesto slot (es. 16:37)

**Ultimo ingresso**: 21:22

Questo pattern fornisce:
- 6 slot all'ora
- 36 slot totali per evento (16:00-21:22)
- 432 posti totali per evento (36 slot × 12 posti)

## 📱 Flusso Utente

1. **Selezione Evento**: L'utente visualizza i 4 eventi disponibili
2. **Scelta Slot**: Selezione dell'orario di ingresso desiderato
3. **Form Prenotazione**: Inserimento dati e numero biglietti
4. **Conferma**: Visualizzazione codice prenotazione e dettagli

## 🔧 Funzionalità Database Avanzate

### Generazione Automatica Slot

```sql
-- Genera slot per un evento
SELECT generate_time_slots('event-id-qui');
```

### Aggiornamento Automatico Disponibilità

I trigger aggiornano automaticamente `available_spots` quando:
- Viene creata una prenotazione
- Viene cancellata una prenotazione

### Trigger e Funzioni

- `update_updated_at_column()`: Aggiorna timestamp di modifica
- `update_slot_availability()`: Gestisce la disponibilità degli slot
- `generate_time_slots()`: Crea slot temporali per un evento

## 🎨 Personalizzazione

### Modificare il Pattern degli Slot

Modifica la funzione `generate_time_slots` in `supabase/schema.sql`:

```sql
v_minutes := ARRAY[0, 7, 15, 22, 30, 37]; -- Cambia questi valori
```

### Modificare Capacità Slot

Nel file schema.sql, modifica:

```sql
max_capacity INTEGER NOT NULL DEFAULT 12, -- Cambia il numero
```

### Stili e Design

I componenti utilizzano Tailwind CSS. Personalizza i colori in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
},
```

## 🔒 Sicurezza

- **Row Level Security (RLS)** abilitato su tutte le tabelle
- Politiche di accesso configurate per limitare operazioni
- Validazione lato server per tutte le operazioni critiche
- Verifiche di disponibilità atomiche

## 📦 Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno nella cartella `dist/`

### Deploy

Deploy consigliati:
- **Vercel**: Deploy automatico da Git
- **Netlify**: Continuous deployment
- **Cloudflare Pages**: Edge computing

```bash
# Esempio con Vercel
npm i -g vercel
vercel
```

## 🧪 Testing

```bash
# Lint del codice
npm run lint

# Preview build di produzione
npm run preview
```

## 🛠️ Sviluppo

### Struttura Progetto

```
frontend/
├── src/
│   ├── components/        # Componenti React
│   │   ├── EventList.jsx
│   │   ├── TimeSlotSelector.jsx
│   │   ├── BookingForm.jsx
│   │   └── BookingConfirmation.jsx
│   ├── services/          # API e logica business
│   │   └── eventService.js
│   ├── lib/              # Configurazioni
│   │   └── supabase.js
│   ├── App.jsx           # Componente principale
│   └── main.jsx          # Entry point
├── supabase/             # Database schema e seed
│   ├── schema.sql
│   └── seed.sql
└── public/               # Asset statici
```

## 🔄 Aggiungere Nuovi Eventi

1. Inserisci nella tabella `events`:

```sql
INSERT INTO events (title, description, event_date, price, status)
VALUES ('Nuovo Evento', 'Descrizione...', '2024-12-20', 30.00, 'active');
```

2. Genera gli slot:

```sql
SELECT generate_time_slots('id-del-nuovo-evento');
```

## 💳 Integrazione Pagamenti

Il sistema è predisposto per l'integrazione con Stripe:

1. Installa Stripe:

```bash
npm install @stripe/stripe-js
```

2. Aggiungi la chiave in `.env`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

3. Implementa il componente di pagamento nel `BookingForm.jsx`

## 📞 Supporto

Per problemi o domande:
- Verifica la console del browser per errori
- Controlla i log di Supabase
- Verifica che le variabili d'ambiente siano corrette

## 📝 TODO e Miglioramenti Futuri

- [ ] Autenticazione utenti con Supabase Auth
- [ ] Email di conferma automatiche
- [ ] Dashboard admin per gestione eventi
- [ ] Sistema di review e rating
- [ ] Export prenotazioni in CSV/Excel
- [ ] Notifiche push per promemoria
- [ ] QR Code per ingresso eventi
- [ ] Sistema di cancellazione prenotazioni
- [ ] Multi-lingua (i18n)

## 📄 Licenza

Questo progetto è fornito come esempio. Personalizza secondo le tue esigenze.

---

Sviluppato con ❤️ usando React, Vite e Supabase
