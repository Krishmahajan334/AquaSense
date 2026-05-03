tell application "Keynote"
activate
set thisDoc to make new document with properties {document theme:theme "White", width:1920, height:1080}
tell slide 1 of thisDoc
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/hero_bg_1777350862486.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"AquaSense", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set subItem to make new text item with properties {object text:"High-Fidelity Smart Water Ecosystem", position:{100, 220}}
set size of character 1 thru -1 of object text of subItem to 36
set color of character 1 thru -1 of object text of subItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Abstract", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"AquaSense is an IoT-driven framework designed to provide granular, zone-specific water telemetry.

Key Innovations:
• Real-time flow analysis using ESP32.
• Autonomous conservation via servo regulation.
• Glassmorphic dashboard for data visualization.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Problem Definition", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"Global and Local Challenges:
• 40% of urban water is lost to leaks.
• Lack of real-time visibility.
• Absence of area-wise data.
• Manual regulation is inefficient.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Strategic Objectives", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"1. Monitor precision water consumption.
2. Track storage tank levels.
3. Implement autonomous valve actuation.
4. Detect anomalies (leaks/bursts).
5. Provide user-friendly command center.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"System Architecture", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/architecture dia.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Hardware Specification", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Node: ESP32
• Flow: YF-S201
• Level: HC-SR04
• Actuator: SG90
• Feedback: 16x2 LCD", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Software Ecosystem", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Edge: C++/Arduino
• Backend: Python Flask
• Frontend: ES6+, Chart.js
• Persistence: CSV
• Alerts: Telegram API", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Use Case Model", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/usecase.jpeg", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Class Architecture", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/class diagram.jpeg", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Object Snapshot", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Object diagram.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Data Flow: Context", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/architecture dia.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Dynamic: Sequence", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Sequence.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"ER Model", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Er diagram.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Process: Activity", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/Activity diagram.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"State Modeling", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/State-chart dia.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Deployment", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
make new image with properties {file:POSIX file "/Users/krishmahajan/Desktop/Aquasense /Diagrams/deployment diagram.png", position:{400, 250}, height:700}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"The Flask Core", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Multi-threaded Telemetry Ingestion.
• Real-time Validation Engine.
• Dynamic API response.
• Fail-safe CSV logging.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Glassmorphic UI", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Modern UI design.
• Interactive Chart.js graphs.
• Status badges (Active/Alert).
• Cross-platform compatibility.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Fault Tolerance", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Secure JSON POST Handshake.
• Latency Management <200ms.
• Continuous flushing to CSV.
• Async UI Polling.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Unit Testing", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"UT-01: Aeration Logic - PASS
UT-02: CSV Persistence - PASS
UT-03: Edge Calculation - PASS
UT-04: UI Rendering - PASS", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Integration Testing", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"IT-01: Sensor Ingestion - PASS
IT-02: Historical Logging - PASS
IT-03: Async Data Retrieval - PASS
IT-04: Telegram Alerts - PASS", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Performance", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• Wastage Reduction: ~35%.
• Alert Latency: <1.5s.
• Accuracy: ±1%.
• Uptime: 100%.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Conclusion", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"AquaSense bridges hardware and intelligence.
Delivers low-cost, high-impact resource management.
Robust, scalable, and intuitive.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Future Scope", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set bodyItem to make new text item with properties {object text:"• ML: Predictive Leakage Forecasting.
• MQTT: Low-power mesh nodes.
• Native Mobile Apps.
• Solar-powered remote nodes.", position:{100, 250}}
set size of character 1 thru -1 of object text of bodyItem to 32
set color of character 1 thru -1 of object text of bodyItem to {65535, 65535, 65535}
end tell
set currentSlide to make new slide at end of thisDoc
tell currentSlide
make new image with properties {file:POSIX file "/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/hero_bg_1777350862486.png", width:1920, height:1080, position:{0, 0}}
set titleItem to make new text item with properties {object text:"Thank You", position:{100, 100}}
set size of character 1 thru -1 of object text of titleItem to 72
set color of character 1 thru -1 of object text of titleItem to {0, 62000, 65535}
set subItem to make new text item with properties {object text:"Engineering for Sustainability", position:{100, 220}}
set size of character 1 thru -1 of object text of subItem to 36
set color of character 1 thru -1 of object text of subItem to {65535, 65535, 65535}
end tell
end tell