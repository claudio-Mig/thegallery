# Sistema di Prenotazione - Quadri Plastici di Avigliano

Sistema completo di prenotazione online per i **Quadri Plastici di Avigliano**, il tradizionale Presepe vivente nel centro storico di Avigliano (PZ). Costruito con React, Vite, Supabase e Tailwind CSS.

## 🎭 L'Evento

I **Quadri Plastici di Avigliano** sono una rappresentazione vivente del Presepe che si svolge tra i caratteristici vicoli del centro storico di Avigliano. Un viaggio emozionante nella tradizione natalizia lucana, dove figuranti in costume d'epoca ricreano le scene della Natività.

### 📅 Date Edizione 2024/2025

- **Prima Serata**: Domenica 15 Dicembre 2024
- **Seconda Serata**: Domenica 22 Dicembre 2024
- **Terza Serata**: Domenica 29 Dicembre 2024
- **Quarta Serata**: Domenica 5 Gennaio 2025

**Orari**: Ingressi dalle 16:00 alle 21:22 (ultimo ingresso)
**Location**: Centro Storico, Avigliano (PZ)
**Prezzo**: €5,00 per persona

## 📋 Caratteristiche del Sistema

- **Prenotazione Online**: Sistema completo per prenotare l'ingresso alle 4 serate
- **Ingressi Contingentati**: Slot temporali ogni 7:30 minuti per garantire la migliore esperienza
- **Gruppi Limitati**: Massimo 12 persone per gruppo
- **Gestione Real-time**: Verifica immediata della disponibilità posti
- **Codice Prenotazione**: Generazione automatica di codici univoci
- **Interfaccia Responsive**: Ottimizzata per desktop, tablet e mobile
- **Design Personalizzato**: Tema rosso e oro ispirati alla tradizione

## 🏗️ Architettura Tecnica

### Frontend
- **React 18** con Vite per prestazioni ottimali
- **Tailwind CSS** per uno styling moderno e responsive
- **date-fns** con localizzazione italiana
- Componenti modulari e riutilizzabili

### Backend
- **Supabase** per database PostgreSQL cloud
- **Row Level Security (RLS)** per la sicurezza dei dati
- Funzioni database per logica business server-side
- API real-time per aggiornamenti disponibilità

## 🚀 Setup e Installazione

### 1. Prerequisiti

- Node.js 18+ e npm installati
- Account Supabase gratuito ([supabase.com](https://supabase.com))
- Git

### 2. Clone e Installazione

```bash
# Clone del repository
git clone [url-repository]
cd thegallery

# Installazione dipendenze
npm install
```

### 3. Configurazione Supabase

#### 3.1 Crea Progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e crea un nuovo progetto
2. Scegli una region (consigliato: EU per l'Italia)
3. Annota l'**URL del progetto** e la **chiave API (anon key)**

#### 3.2 Configura Database

1. Nel tuo progetto Supabase, vai in **SQL Editor**
2. Crea una nuova query e incolla il contenuto di `supabase/schema.sql`
3. Esegui la query per creare tabelle, funzioni e trigger
4. Crea un'altra query con il contenuto di `supabase/seed.sql`
5. **IMPORTANTE**: Verifica le date nel seed.sql prima di eseguire
6. Esegui la query per popolare i dati degli eventi

```sql
-- Le date nel seed.sql sono:
-- 15 Dicembre 2024, 22 Dicembre 2024, 29 Dicembre 2024, 5 Gennaio 2025
-- Modifica se necessario prima di eseguire
```

### 4. Configurazione Variabili d'Ambiente

```bash
# Copia il template
cp .env.example .env

# Modifica .env con i tuoi valori
```

Contenuto `.env`:
```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-anon-key-qui
```

### 5. Avvia il Server di Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## 📊 Schema Database

### Tabelle Principali

#### `events`
Gestisce le 4 serate dei Quadri Plastici
- `id` (UUID): Identificativo univoco
- `title` (VARCHAR): Titolo evento (es. "Quadri Plastici - Prima Serata")
- `description` (TEXT): Descrizione dettagliata
- `event_date` (DATE): Data dell'evento
- `price` (DECIMAL): Prezzo biglietto (5.00€)
- `start_time` (TIME): Ora inizio ingressi (16:00)
- `last_entry_time` (TIME): Ultimo ingresso (21:22)
- `status` (VARCHAR): Stato evento (active/cancelled/completed)

#### `time_slots`
Slot temporali per ogni evento (generati automaticamente)
- `id` (UUID): Identificativo univoco
- `event_id` (UUID): Riferimento all'evento
- `slot_time` (TIME): Orario slot (16:00, 16:07, 16:15, ecc.)
- `max_capacity` (INTEGER): Capacità massima (12)
- `available_spots` (INTEGER): Posti disponibili
- `status` (VARCHAR): Stato slot (available/full/closed)

#### `bookings`
Prenotazioni degli utenti
- `id` (UUID): Identificativo univoco
- `event_id` (UUID): Evento prenotato
- `time_slot_id` (UUID): Slot temporale
- `user_name` (VARCHAR): Nome utente
- `user_email` (VARCHAR): Email utente
- `user_phone` (VARCHAR): Telefono utente
- `num_tickets` (INTEGER): Numero biglietti (1-12)
- `total_amount` (DECIMAL): Importo totale
- `booking_reference` (VARCHAR): Codice univoco prenotazione
- `payment_status` (VARCHAR): Stato pagamento
- `status` (VARCHAR): Stato prenotazione

## 🕐 Logica Slot Temporali

Gli ingressi sono organizzati con questo pattern ogni ora:

**Pattern orario** (ripetuto dalle 16:00 alle 21:00):
- **:00** - Primo gruppo (es. 16:00, 17:00, 18:00...)
- **:07** - Secondo gruppo
- **:15** - Terzo gruppo
- **:22** - Quarto gruppo
- **:30** - Quinto gruppo
- **:37** - Sesto gruppo

**Ultimo ingresso**: 21:22

Questo garantisce:
- 6 gruppi all'ora
- Circa 7:30 minuti tra un gruppo e l'altro
- 36 slot totali per serata (16:00-21:22)
- 432 posti totali per serata (36 slot × 12 persone)
- **1.728 posti totali** per l'intera manifestazione (4 serate)

## 📱 Flusso Utente

1. **Homepage**: Visualizzazione delle 4 serate disponibili con date e dettagli
2. **Selezione Slot**: Scelta dell'orario di ingresso preferito
3. **Form Prenotazione**: Inserimento dati (nome, email, telefono, numero biglietti)
4. **Conferma**: Visualizzazione codice prenotazione e istruzioni

### Informazioni Fornite all'Utente

Alla conferma della prenotazione, l'utente riceve:
- **Codice prenotazione univoco** (da portare all'evento)
- Riepilogo completo (data, ora, numero biglietti)
- **Istruzioni importanti**:
  - Presentarsi 10 minuti prima dell'orario
  - Punto di ritrovo nel centro storico
  - Pagamento all'ingresso (€5,00/persona)
  - Durata percorso: 45-60 minuti
  - Percorso in gruppo (max 12 persone)

## 🔧 Funzionalità Database Avanzate

### Generazione Automatica Slot

La funzione `generate_time_slots(event_id)` crea automaticamente tutti gli slot:

```sql
-- Esempio: genera slot per un evento
SELECT generate_time_slots('uuid-evento-qui');
```

### Aggiornamento Disponibilità Automatico

I trigger PostgreSQL gestiscono automaticamente:
- Decremento `available_spots` quando si crea una prenotazione
- Cambio `status` a "full" quando i posti finiscono
- Ripristino disponibilità in caso di cancellazione

### Trigger Implementati

- `update_updated_at_column()`: Timestamp automatico di modifica
- `update_slot_availability()`: Gestione disponibilità posti
- `generate_time_slots()`: Creazione slot temporali

## 🎨 Personalizzazione

### Modificare Date o Prezzo

Modifica `supabase/seed.sql` prima di eseguirlo:

```sql
INSERT INTO events (title, description, event_date, price, status) VALUES
(
  'Quadri Plastici - Prima Serata',
  'Descrizione...',
  '2024-12-15',  -- ← Cambia data
  5.00,          -- ← Cambia prezzo
  'active'
);
```

### Modificare Pattern Slot Temporali

Modifica la funzione in `supabase/schema.sql`:

```sql
-- Attuale: [0, 7, 15, 22, 30, 37]
v_minutes := ARRAY[0, 7, 15, 22, 30, 37];
```

### Modificare Capacità Gruppo

Nel file `schema.sql`:

```sql
max_capacity INTEGER NOT NULL DEFAULT 12,  -- Cambia 12
```

### Personalizzare Colori

Modifica `tailwind.config.js` o i componenti:

```js
// Colori principali usati:
// Rosso: from-red-700 to-red-900 (tema principale)
// Verde: green-600 (conferma/successo)
// Ambra: amber-500 (avvisi/info)
```

## 🔒 Sicurezza

- **Row Level Security (RLS)** attivo su tutte le tabelle
- Politiche di accesso configurate:
  - Lettura pubblica eventi attivi
  - Lettura pubblica slot disponibili
  - Inserimento pubblico prenotazioni (con validazione)
- Validazione lato server per disponibilità
- Verifiche atomiche per evitare overbooking
- Variabili d'ambiente per credenziali sensibili

## 📦 Build per Produzione

```bash
# Build ottimizzata
npm run build

# Preview della build
npm run preview
```

I file ottimizzati saranno in `dist/`

### Deploy Consigliati

**Vercel** (Consigliato):
```bash
npm i -g vercel
vercel
```

**Netlify**:
```bash
npm install netlify-cli -g
netlify deploy --prod
```

**Cloudflare Pages**: Deploy diretto da GitHub

## 🛠️ Struttura Progetto

```
thegallery/
├── src/
│   ├── components/              # Componenti React
│   │   ├── EventList.jsx       # Lista 4 eventi
│   │   ├── TimeSlotSelector.jsx # Selezione orario
│   │   ├── BookingForm.jsx     # Form prenotazione
│   │   └── BookingConfirmation.jsx # Conferma
│   ├── services/
│   │   └── eventService.js     # API Supabase
│   ├── lib/
│   │   └── supabase.js         # Config Supabase
│   ├── App.jsx                 # Router principale
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind CSS
├── supabase/
│   ├── schema.sql              # Schema database
│   └── seed.sql                # Dati eventi
├── public/                     # Asset statici
├── .env.example                # Template variabili
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🧪 Testing e Sviluppo

```bash
# Lint del codice
npm run lint

# Build di test
npm run build && npm run preview
```

## 📞 Supporto e Troubleshooting

### Problemi Comuni

**1. Errore connessione Supabase**
- Verifica `.env` con URL e chiave corretti
- Controlla che il progetto Supabase sia attivo
- Verifica le politiche RLS nel dashboard Supabase

**2. Slot non visualizzati**
- Verifica che `seed.sql` sia stato eseguito
- Controlla che la funzione `generate_time_slots` sia stata creata
- Verifica le date degli eventi (devono essere future)

**3. Errore prenotazione**
- Verifica disponibilità posti nello slot
- Controlla i log del browser (console)
- Verifica i log di Supabase (sezione Logs)

## 📝 TODO e Miglioramenti Futuri

- [ ] Email di conferma automatiche (Supabase + SendGrid)
- [ ] Dashboard admin per gestire prenotazioni
- [ ] Export prenotazioni in CSV/Excel
- [ ] QR Code nel codice prenotazione
- [ ] Sistema di cancellazione prenotazioni
- [ ] Notifiche SMS reminder
- [ ] Mappa interattiva del percorso
- [ ] Galleria foto edizioni precedenti
- [ ] Recensioni e feedback post-evento
- [ ] Integrazione pagamento online (Stripe)

## 👥 Crediti

Sistema sviluppato per i **Quadri Plastici di Avigliano**
In collaborazione con **Regione Basilicata**

### Tecnologie Utilizzate
- React 18
- Vite
- Supabase
- Tailwind CSS
- date-fns

## 📄 Licenza

Questo progetto è sviluppato per l'evento "Quadri Plastici di Avigliano".

---

**Avigliano (PZ)** - Centro Storico
Un evento della tradizione lucana 🎭
