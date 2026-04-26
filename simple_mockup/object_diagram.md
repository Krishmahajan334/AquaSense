# AquaSense Object Diagram

The following Object Diagram illustrates a snapshot of the AquaSense mockup at runtime. It shows the active software components, their internal state (values), and their references to one another.

```mermaid
classDiagram
    %% Root Application Instances
    class FlaskApp {
        <<Instance>>
        host = "0.0.0.0"
        port = 5050
        debug = True
        frontend_dir = "../frontend"
    }

    class HardwareSimulator {
        <<Instance>>
        base_in = 20.0
        base_k = 3.0
        base_b = 6.0
        base_g = 8.0
        cycle_count = 12
    }

    %% System Data Dictionary (In-Memory State)
    class system_data {
        <<Dictionary>>
        total_water_usage = 12.5
        total_water_saved = 4.1
        total_output_flow = 16.5
        main_input_flow = 20.3
        tank_level = 85.0
        supply_available = True
        auto_mode = False
        last_update = "2026-04-21 14:30:00"
    }

    %% Area states nested within system_data
    class KitchenArea {
        <<Dictionary>>
        name = "Kitchen"
        flow_rate = 2.8
        water_usage = 4.2
        aeration = 0
        valve_open = True
    }

    class BathroomArea {
        <<Dictionary>>
        name = "Bathroom"
        flow_rate = 6.1
        water_usage = 5.5
        aeration = 20
        valve_open = True
    }

    class GardenArea {
        <<Dictionary>>
        name = "Garden/Plantation"
        flow_rate = 7.6
        water_usage = 2.8
        aeration = 0
        valve_open = True
    }

    %% Data Storage Instance
    class HistoryFile {
        <<File>>
        path = "history.csv"
        records_count = 500
    }

    %% Relationships
    FlaskApp --> system_data : "Manages global state"
    system_data *-- KitchenArea : "areas['kitchen']"
    system_data *-- BathroomArea : "areas['bathroom']"
    system_data *-- GardenArea : "areas['garden']"
    
    FlaskApp --> HistoryFile : "Writes runtime updates"
    HardwareSimulator --> FlaskApp : "POSTs random flow telemetry"
```

## Key Aspects of the Object Graph
1. **`HardwareSimulator` (C++)**: Connects to the Flask backend to push runtime simulation telemetry (like random changes to `base_k` and `base_b` flows).
2. **`FlaskApp`**: Manages the HTTP server config and maintains a reference to the global `system_data` dictionary.
3. **`system_data`**: Acts as the central in-memory store for the application's real-time state, referencing individual area dictionary objects.
4. **`HistoryFile`**: The backend appends a subset of properties from `system_data` to this CSV object iteratively.
