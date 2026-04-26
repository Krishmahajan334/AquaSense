# AquaSense Data Flow Diagrams (DFD)

Data flow diagrams show how data moves through an information system. 

## Level 0 (Context Diagram)
The Context Diagram shows the system as a single black-box process and its relationship with external entities (Users and Hardware).

```mermaid
graph LR
    User["User / Admin"]
    Sensors["Hardware Sensors"]
    System("AquaSense Management System")

    Sensors -- "Raw Flow & Tank Data" --> System
    System -- "Control Commands (Valves / Auto-Aeration)" --> Sensors
    
    User -- "Granularity Parameters (Hourly, Daily, Monthly)" --> System
    User -- "Hardware Override Settings" --> System
    
    System -- "Real-time Dashboard Statistics & Live Alerts" --> User
    System -- "Time-series Flow Analytics" --> User
```

## Level 1 (Functional Decomposition)
Level 1 breaks the system down into its primary subsystems (processes), exposing the major internal data stores (like the CSV History).

```mermaid
graph TD
    User["User / Admin"]
    Sensors["Hardware Simulator"]
    
    D1[/"Data Store 1: History Logging (CSV)"\]
    D2[/"Data Store 2: In-Memory State (Dictionary)"\]

    subgraph "AquaSense Internal Capabilities"
        P1("1.0 Telemetry Ingestion")
        P2("2.0 History Data Logger")
        P3("3.0 Reporting & Historical Aggregation")
        P4("4.0 User View API & Serve")
        P5("5.0 Settings & Control Configuration")
    end

    Sensors -- "JSON Telemetry POST" --> P1
    P1 -- "Update Dictionaries" --> D2
    P1 -- "Normalized Record" --> P2
    P2 -- "Append File Row" --> D1
    
    User -- "Change Auto Mode / Aeration" --> P5
    P5 -- "Apply Flags" --> D2
    
    D1 -- "Raw 500 Records" --> P3
    P3 -- "Aggregated Timeline" --> P4
    
    D2 -- "Live Dashboard Variables" --> P4
    
    User -- "Request Insights & Interface" --> P4
    P4 -- "Rendered Pages & API Response" --> User
```

## Level 2 (Sub-Process Decomposition)
Level 2 breaks a major Level 1 process into its detailed, step-by-step data transformations. Here is the Level 2 DFD for **Process 1.0 (Telemetry Ingestion)**, detailing how the Python backend computes saved water and handles constraints:

```mermaid
graph TD
    Sensors["Hardware HTTP Post"]
    D2[/"Data Store 2: In-Memory State"\]
    P2("2.0 History Data Logger")

    subgraph "Process 1.0 Decomposition (Telemetry Handling)"
        P1_1("1.1 Extract Node Flow Rates")
        P1_2("1.2 Scale Aeration Reductions")
        P1_3("1.3 Compute Water Usage & Savings")
        P1_4("1.4 Evaluate Flow Anomalies")
        P1_5("1.5 Commit Net Tank Adjustments")
    end

    Sensors -- "HTTP Body Payload" --> P1_1
    P1_1 -- "Raw Individual Node Rates" --> P1_2
    
    D2 -. "Fetch Active Config / Auto-Mode Specs" .-> P1_2
    
    P1_2 -- "Effective Consumed Flow" --> P1_3
    P1_3 -- "Calculated Saved Water Metrics" --> P1_4
    
    P1_4 -- "Push Alert (If Leaks Detected)" --> D2
    P1_4 -- "Validated Area Data" --> P1_5
    
    P1_5 -- "Overall Updates" --> D2
    P1_5 -- "Finalized Row Structure" --> P2
```
