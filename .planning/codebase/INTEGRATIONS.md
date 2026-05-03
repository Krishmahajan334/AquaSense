# Integrations

## Internal Integrations
- **Backend <-> Hardware Simulator:** Python server communicates with the C++ simulator (likely via subprocess or socket/file-based IPC).
- **Backend <-> Frontend:** RESTful API endpoints in Flask consumed by Vanilla JS Fetch API.

## External Integrations
- **Google Firebase/Firestore:** Persistent cloud storage for telemetry data and configuration.
- **Telegram Bot API:** Remote monitoring and control interface via `/report`, `/area stats`, etc.
- **Google Cloud Platform:** Hosting/Deployment target (Cloud Run indicated by MCP tools).

## Hardware Interface
- **Telemetry Ingest:** Simulation of pH, Turbidity, and Flow Rate sensors.
- **Control Loop:** Remote commands from Dashboard/Telegram back to simulation state.
