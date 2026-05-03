# Architecture

## System Overview
AquaSense is a tiered IoT monitoring and control system composed of three primary layers:
1. **Physical/Simulation Layer:** C++ based hardware simulator providing telemetry.
2. **Persistence & Logic Layer:** Python Flask backend managing data flow, Firebase synchronization, and bot interactions.
3. **User Interaction Layer:** Web-based dashboard for real-time visualization and remote administration.

## Design Patterns
- **Separation of Concerns:** Clear directory separation between `frontend`, `backend`, and `hardware_sim`.
- **Observer Pattern (Implicit):** Real-time polling from the frontend to reflect backend state changes.
- **Singleton (Simulator):** Centralized simulator managing the state of all virtual water zones.

## Data Flow
1. **Sensors (Simulator)** -> Generate Data.
2. **Backend (Python)** -> Fetch Data -> Store in CSV/Firestore.
3. **Client (Web/Bot)** -> Request Data -> Visualize/Alert.
