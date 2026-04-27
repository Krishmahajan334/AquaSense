# Chapter 6: Integration and Testing

## 6.1 Description of the Integration Modules

The AquaSense system architecture relies on the seamless integration of three primary, decoupled modules. The integration strategy utilizes standard HTTP protocols and local file I/O to ensure modularity and fault tolerance:

### 1. Hardware-to-Backend Integration (Sensor Ingestion)
This module integrates the C++ Hardware Simulator with the Python Flask Server. The integration is achieved over the local network via stateless HTTP POST requests. The C++ simulator acts as the client, serializing randomized flow-meter data into a standard JSON payload and pushing it to the `/api/data` endpoint. The backend parses this JSON, integrating the raw hardware telemetry into the core Python logic engine.

### 2. Backend-to-Storage Integration (Data Persistence)
To ensure historical data is preserved for analytics without the overhead of a complex SQL database, the Python backend integrates directly with the host machine's file system. During each data cycle, the aggregation engine flushes the current state of the global Python dictionary into `history.csv`. This integration handles thread-safe appending of comma-separated values to ensure data integrity over long-term operation.

### 3. Backend-to-Frontend Integration (Dashboard Analytics)
This module connects the user-facing HTML/JavaScript interface to the Flask REST API. The integration is handled purely via asynchronous JavaScript `fetch()` API calls. The dashboard makes periodic HTTP GET requests to the backend endpoints (`/api/data` for live stats, and `/api/reports` for historical charts). By decoupling the frontend from the backend, the integration ensures the web UI remains highly responsive, dynamically updating DOM elements and Chart.js canvases without requiring a full page reload.

---

## 6.2 Testing Methodology

To verify the robustness and accuracy of the system, three levels of testing were performed: Unit Testing, Integration Testing, and System Testing.

### 6.2.1 Unit Testing
Unit testing focused on validating individual components and logic functions in isolation to ensure they produce correct outputs for given inputs.

| Test ID | Component | Test Scenario | Input Data | Expected Outcome | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| UT-01 | Python Backend | Aeration Scaling Logic | `tank_level = 10%` | Aeration set to 90% | Pass |
| UT-02 | Python Backend | CSV Logging Function | `system_data` object | Row appended to `history.csv` | Pass |
| UT-03 | C++ Simulator | Random Flow Generation | Base flow = 5.0 | Output within 10% variance | Pass |
| UT-04 | JS Frontend | Unit Conversion | Value: 1000ml | Display: "1.0 L" | Pass |
| UT-05 | Python Backend | Alert Trigger Logic | Flow > 12.0 L/m | "High Flow" alert string generated | Pass |

### 6.2.2 Integration Testing
Integration testing verified the communication between different modules, ensuring data integrity is maintained across system boundaries.

| Test ID | Interface | Test Scenario | Input Data | Expected Outcome | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| IT-01 | C++ -> Flask | Sensor Data Ingestion | JSON: `{"main_flow": 10.0}` | HTTP 200 OK; Backend data updated | Pass |
| IT-02 | Flask -> CSV | Persistence Validation | Data Update Event | File `history.csv` size increases | Pass |
| IT-03 | Flask -> JS | API Data Retrieval | GET `/api/data` | Valid JSON received by frontend | Pass |
| IT-04 | Flask -> Telegram | Alert Notification | Critical Leak Trigger | Push notification received on mobile | Pass |
| IT-05 | Telegram -> Flask | Remote Command | `/area control kitchen valve off` | Kitchen valve status set to False | Pass |

### 6.2.3 System Testing (End-to-End)
System testing validated the complete workflow from sensor detection to user notification and automated control.

| Test ID | Scenario Description | Input/Trigger | Expected System Response | Actual Outcome | Pass/Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ST-01 | Normal Operation | Valid Sensor Data | Dashboard updates every 2s; Charts reflect live usage. | As expected | Pass |
| ST-02 | Critical Tank Level | Level < 20% | Auto-Mode triggers; Flow restricted; Critical alert sent. | As expected | Pass |
| ST-03 | Leak Detection | Flow > 14 L/m | "High Flow Anomaly" alert; Valve automatically capped at 20%. | As expected | Pass |
| ST-04 | Supply Cut Fallback | `main_flow = 0.0` | Dashboard shows "Water Cut"; System enters conservation. | As expected | Pass |
| ST-05 | Error Resilience | Empty POST Request | HTTP 400 Error; Server remains stable and active. | As expected | Pass |
| ST-06 | Telegram Monitoring | `/report` command | Bot replies with Tank Level, Usage, and Auto-Mode status. | As expected | Pass |

---

## 6.3 Conclusion
The testing phase confirmed that the AquaSense system is highly resilient. Unit tests verified the mathematical accuracy of the conservation logic, integration tests confirmed seamless communication between C++ and Python modules, and system tests proved that the end-to-end automation—including Telegram notifications and Auto-Mode throttling—functions correctly under various environmental conditions.
