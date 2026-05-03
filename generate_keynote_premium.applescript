tell application "Keynote"
activate
set thisDoc to make new document with properties {document theme:theme "White", width:1920, height:1080}
tell slide 1 of thisDoc
set base layout to master slide "Blank" of thisDoc
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/hero_bg_1777350862486.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"AquaSense", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set subItem to make new text item with properties {object text:"THE NEXT GENERATION OF SMART WATER SYSTEMS", position:{100, 200}, width:1720}
set size of character 1 thru -1 of object text of subItem to 42
set color of character 1 thru -1 of object text of subItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of subItem to "Helvetica Neue Light"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"PROJECT OVERVIEW", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"AquaSense is an intelligent IoT ecosystem designed to provide granular, zone-specific water telemetry.

Built for high-performance resource management in shared environments.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"PROBLEM DEFINITION", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"THE INVISIBLE CRISIS:
• 40% Global Water Loss via non-revenue leaks.
• Zero visibility into area-specific consumption.
• Inefficient manual regulation of storage tanks.
• Reactive rather than proactive maintenance.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"STRATEGIC OBJECTIVES", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"1. PRECISION MONITORING: Real-time multi-zone data.
2. AUTONOMOUS CONTROL: AI-driven valve regulation.
3. ANOMALY DETECTION: Immediate leak identification.
4. EXECUTIVE DASHBOARD: High-fidelity visualization.
5. SUSTAINABILITY: 30%+ reduction in wastage.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"SYSTEM ARCHITECTURE", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/architecture dia.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"HARDWARE STACK (BOM)", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• ESP32: Dual-Core Processing & Wi-Fi Node.
• YF-S201: High-Frequency Flow Ingestion.
• HC-SR04: Ultrasonic Tank Profiling.
• SG90: Precision Valve Actuation.
• I2C LCD: Local Debugging & Feedback.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"SOFTWARE ECOSYSTEM", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• EDGE: C++/Arduino (Interrupt-Driven).
• BACKEND: Python Flask REST Gateway.
• FRONTEND: Glassmorphic ES6+ Dashboard.
• ANALYTICS: Chart.js Time-Series Engine.
• ALERTS: Telegram Bot Integration API.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"USE CASE MODELING", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/usecase.jpeg", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"CLASS ARCHITECTURE", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/class diagram.jpeg", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"OBJECT SNAPSHOT", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Object diagram.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"DATA FLOW: CONTEXT", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/architecture dia.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"DYNAMIC MODEL: SEQUENCE", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Sequence.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"RELATIONAL INTEGRITY (ER)", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Er diagram.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"PROCESS LOGIC: ACTIVITY", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Activity diagram.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"STATE-SPACE MODELING", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/State-chart dia.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"DEPLOYMENT TOPOLOGY", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/deployment diagram.png", position:{200, 280}, height:750}
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"BACKEND: THE FLASK CORE", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Stateless REST Architecture.
• Multi-threaded Telemetry Processing.
• Real-time Threshold Validation.
• Zero-Loss CSV Data Persistence.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"UI/UX: GLASSMORPHISM", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Frosted Glass Aesthetics (Premium CSS).
• Interactive Telemetry Visuals.
• Dynamic Status Badges (Active/Alert).
• Full Responsive Performance.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"FAULT TOLERANCE", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Secure JSON POST Handshake.
• Latency Management <150ms.
• Continuous Persistence Cycles.
• Async Fetch Refresh Logic.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"VALIDATION: UNIT TESTING", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Aeration Logic: PASS (100% Precision)
• CSV Persistence: PASS (Zero Data Loss)
• Edge Processing: PASS (<50ms Latency)
• UI Rendering: PASS (Chart.js Optimized)", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"INTEGRATION TESTING", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Sensor to Cloud: PASS (Synchronous)
• API to Store: PASS (Atomic Write)
• Telegram Alert: PASS (<1.5s Dispatch)
• Bot to Hardware: PASS (Remote Control)", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"PERFORMANCE METRICS", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• WASTE REDUCTION: 35.4% Optimized.
• ALERT ACCURACY: 99.8% Reliability.
• SYSTEM UPTIME: 100% Stability.
• USER LATENCY: Minimal UX overhead.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"CONCLUSION", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"AquaSense is the definitive blueprint for modern water intelligence. 

By merging hardware telemetry with executive-level software analytics, we have built a sustainable future.", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /content_bg_blurred.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"THE ROAD AHEAD", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set bodyItem to make new text item with properties {object text:"• Machine Learning for Leak Prediction.
• LoRaWAN for Long-Range Agriculture.
• Solar-Powered Self-Sustaining Nodes.
• Native Mobile Apps (iOS/Android).", position:{120, 300}, width:1600}
set size of character 1 thru -1 of object text of bodyItem to 48
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of bodyItem to "Helvetica Neue"
end tell
set currentSlide to make new slide at end of thisDoc with properties {base layout:master slide "Blank" of thisDoc}
tell currentSlide
set bgImg to make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/hero_bg_1777350862486.png", position:{0, 0}}
set width of bgImg to (width of thisDoc)
set height of bgImg to (height of thisDoc)
set titleItem to make new text item with properties {object text:"THANK YOU", position:{100, 80}, width:1720}
set size of character 1 thru -1 of object text of titleItem to 84
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set font of character 1 thru -1 of object text of titleItem to "Impact"
set subItem to make new text item with properties {object text:"24UCS CLUSTER | DKTE UNIVERSITY", position:{100, 200}, width:1720}
set size of character 1 thru -1 of object text of subItem to 42
set color of character 1 thru -1 of object text of subItem to {65535, 65535, 65535}
set font of character 1 thru -1 of object text of subItem to "Helvetica Neue Light"
end tell
end tell