# AquaSense System Architecture & Design

This document details the software architecture and data flow of the AquaSense Water Management System.

## 1. System Architecture

The project follows a **Modified Client-Server Architecture** with three distinct layers:

```mermaid
graph TD
    subgraph "Presentation Layer (Frontend)"
        UI[Dashboard / Analytics UI]
        JS[Logic / Chart.js Engine]
    end

    subgraph "Application Layer (Backend)"
        API[Flask REST API]
        AGG[Aggregation & Analytics Engine]
    end

    subgraph "Data Layer"
        CSV[(history.csv)]
    end

    subgraph "Hardware Layer"
        SIM[C++ Hardware Simulator]
    end

    SIM -- "JSON telemetry (POST)" --> API
    API -- "Append logs" --> CSV
    CSV -- "Read Raw/Aggregated" --> AGG
    AGG -- "Report Data" --> API
    API -- "JSON data" --> JS
    JS -- "Render View" --> UI
    UI -- "Control Cmds" --> API
    API -- "Modify State" --> SIM
```

---

## 2. Data Flow Diagrams (DFD)

### Level 0: Context Diagram
The Context Diagram shows the system as a single process and its relationship with external entities. (Following standard DFD notation: Squares for External Entities, Rounded/Circles for Processes).

```mermaid
graph LR
    User["User / Admin"]
    Sensors["Hardware Sensors"]
    System("AquaSense System")

    Sensors -- "Flow & Tank Data" --> System
    System -- "Control Commands (Valves/Aeration)" --> Sensors
    
    User -- "Filter / Report Requests" --> System
    User -- "Configuration / Settings" --> System
    System -- "Real-time Dashboard & Alerts" --> User
    System -- "Dynamic Analytics Reports" --> User
```

---

### Level 1: Functional Decomposition
Level 1 breaks the system into its primary functional processes.

```mermaid
graph TD
    User["User / Admin"]
    Sensors["Hardware Sensors"]
    D1[/"History Store - CSV"\]

    subgraph "AquaSense System Processes"
        P1("1.0 Telemetry Handler")
        P2("2.0 Data Logger")
        P3("3.0 Reporting & Analysis")
        P4("4.0 User API & Serve")
        P5("5.0 Control Logic")
    end

    Sensors -- "Raw Data" --> P1
    P1 -- "Cleaned Data" --> P2
    P2 -- "Write Row" --> D1
    
    D1 -- "Historic Records" --> P3
    P3 -- "Aggregated Stats" --> P4
    
    User -- "Request Report" --> P4
    P4 -- "Visual Data" --> User
    
    User -- "Adjustment Cmd" --> P4
    P4 -- "Signal" --> P5
    P5 -- "Valve/Aeration Cmd" --> Sensors
```

---

## 3. Data Dictionary (Key Entities)

| Data Element | Source | Description |
| :--- | :--- | :--- |
| **InputFlow** | Sensors | Main municipal water supply rate (L/m). |
| **OutputFlow** | Sensors | Total summary of water leaving the tank (Sum of all areas). |
| **AreaFlows** | Sensors | Individual telemetry for Kitchen, Bathroom, and Garden. |
| **TankLevel** | Sensors | Current percentage of tank capacity. |
| **WaterSaved** | System | Calculated volume of water recovered via aeration mapping. |
| **Granularity** | User | Selection parameter (Hourly/Daily/Weekly/Monthly) for P3. |

---

## 4. Hardware-Software Interface
The system communicates via **HTTP/REST**. The Hardware tier (C++) acts as a producer, pushing data to the API at a frequency of 0.5Hz (every 2 seconds). The Presentation tier (Web) acts as a consumer, polling or requesting aggregated insights on-demand.

---

## 5. Entity-Relationship (ER) Diagram
This diagram represents the normalized relational database structure of the AquaSense system telemetry and configuration. It uses standard Crow's Foot notation.

```mermaid
erDiagram
    SYSTEM_TELEMETRY ||--o{ AREA_TELEMETRY : "contains"
    AREA ||--o{ AREA_TELEMETRY : "generates"
    
    SYSTEM_TELEMETRY {
        datetime timestamp PK "Time of recording"
        float main_input_flow "Supply L/min"
        float total_output_flow "Total L/min"
        float tank_level "Percentage 0-100"
        float water_saved "Saved via aeration"
        boolean supply_available "Main supply status"
    }

    AREA {
        string area_id PK "e.g., kitchen, bathroom"
        string area_name "Display Name"
    }

    AREA_TELEMETRY {
        int record_id PK "Unique Log ID"
        datetime timestamp FK "Ref SYSTEM_TELEMETRY"
        string area_id FK "Ref AREA"
        float flow_rate "Current L/min"
        int aeration "Aeration level 0-100"
        boolean valve_open "Valve status"
        float water_usage "Cumulative usage"
    }
    
    SYSTEM_CONFIGURATION {
        string config_id PK
        boolean auto_mode "Global auto mode"
    }
```
