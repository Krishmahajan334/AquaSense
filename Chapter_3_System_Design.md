# Chapter 3: System Design

## 3.1 User Interface Design

The User Interface (UI) of AquaSense is engineered to provide a seamless, real-time monitoring experience for complex water management systems. The design philosophy centers around high visibility, responsiveness, and intuitive navigation.

**Visual Aesthetics & Layout:**
*   **Theme:** The system employs a modern "Dark Mode" aesthetic using deep backgrounds (slate/black) contrasted with vibrant, glowing neon accents (cyan, electric blue, and alert red). This maximizes readability and reduces eye strain during continuous monitoring.
*   **Architecture:** The UI utilizes a sidebar-based navigation architecture, allowing operators to quickly switch between the core modules: Dashboard, Analytics, Areas, Settings, and Admin Panel. 
*   **Interactive Elements:** The main dashboard features an interactive SVG-based visualization of the water pipeline and tank. As data flows in from the hardware, the SVG elements dynamically animate (e.g., water levels rise/fall, pipes simulate flow), providing instant visual feedback on the system's status without the need to read raw numbers.

**Key Pages:**
1.  **Dashboard:** The primary real-time monitoring hub. It displays active flow rates (Inflow, Outflow, Borewell, Ground Level) via gauge cards and a live-updating line chart using Chart.js.
2.  **Analytics:** A dedicated historical reporting interface. It aggregates data from the backend CSV database to generate Daily Reports, complete with textual summaries of total water consumption, efficiency ratings, and interactive historical charts.
3.  **Admin Panel:** A secure configuration zone protected by an authentication overlay. It allows administrators to manage external integrations, such as entering the Telegram Bot API credentials for push notifications, and performing factory resets.

**Technology Stack:**
The UI is built using lightweight, dependency-free technologies to ensure maximum performance: HTML5, Vanilla CSS3 (utilizing CSS variables and Flexbox/Grid for layout), and Vanilla JavaScript (ES6+). Icons are served via the Ionicons CDN.

---

## 3.2 Algorithmic Description of Each Module

The AquaSense system is divided into three primary functional modules: the Hardware Simulator (Edge), the Backend API Server (Core), and the Frontend Application (Client). 

### 3.2.1 Hardware Simulation Module
**Purpose:** To emulate physical IoT sensors (flow meters and ultrasonic level sensors) in the absence of live hardware during the development and testing phases.
**Algorithm:**
1.  **Initialize:** Define baseline flow parameters (Inflow = ~18 L/min, Outflow = ~3 L/min, etc.).
2.  **Loop Execution:** Enter an infinite `while` loop with a 1-second delay interval.
3.  **Noise Generation:** Apply a randomized mathematical perturbation (noise) to the baseline values to simulate real-world sensor fluctuations and fluid dynamics.
4.  **Payload Construction:** Format the calculated sensor readings into a JSON payload.
5.  **Transmission:** Execute an HTTP POST request to the Backend Server's `/api/data` endpoint using the `libcurl` library.
6.  **Repeat:** Return to Step 2.

### 3.2.2 Backend API & Data Persistence Module
**Purpose:** To ingest real-time data, detect anomalies, store historical records, and serve data to the frontend UI.
**Algorithm:**
1.  **Data Ingestion (`/api/data` POST):** 
    *   Receive JSON payload from the hardware module.
    *   Extract timestamp, Inflow, Outflow, Borewell, and Ground Level values.
    *   Append the record as a new row to the persistent storage file (`history.csv`).
    *   Update the in-memory cache with the latest reading for rapid frontend retrieval.
2.  **Anomaly Detection:**
    *   Compare the `Outflow` metric against the `Inflow` metric over a rolling window.
    *   If `(Inflow - Outflow) > Threshold` for `N` consecutive cycles, trigger a internal Leak Warning state.
3.  **Data Retrieval (`/api/data` GET):**
    *   Respond to frontend polling requests by returning the 10 most recent cached data points in JSON format.
4.  **Daily Report Aggregation (`/api/daily-report` GET):**
    *   Read the entire `history.csv` file.
    *   Filter rows to isolate data from the last 24 hours.
    *   Downsample the data points (e.g., take every Nth record) to prevent overloading the frontend chart rendering engine, returning a streamlined JSON array.

### 3.2.3 Alerting & Notification Module (Telegram Integration)
**Purpose:** To dispatch critical alerts to administrators in real-time via the Telegram messaging platform.
**Algorithm:**
1.  **Configuration Check:** Verify that the administrator has saved a valid Telegram Bot API Token and Chat ID in the `config.json` file via the Admin UI.
2.  **Trigger Condition:** Await an anomaly trigger from the Backend API module (e.g., a detected leak or a manual test signal).
3.  **Payload Construction:** Format a user-friendly alert message string containing the current sensor readings and the nature of the emergency.
4.  **API Dispatch:** 
    *   Construct the target URL: `https://api.telegram.org/bot<TOKEN>/sendMessage`.
    *   Execute an asynchronous HTTP POST request containing the `chat_id` and `text` payload.
    *   Log success or handle HTTP errors if the Telegram servers are unreachable.
