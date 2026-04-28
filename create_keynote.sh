#!/bin/bash

# Path to images
HERO_BG="/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/hero_bg_1777350862486.png"
CONTENT_BG="/Users/krishmahajan/.gemini/antigravity/brain/a86acce6-e4eb-4fad-a0cc-f56ee1447b3b/content_bg_1777350898250.png"
DIAGRAMS_DIR="/Users/krishmahajan/Desktop/Aquasense /Diagrams"

osascript <<EOF
tell application "Keynote"
    activate
    set thisDoc to make new document with properties {document theme:theme "White", width:1920, height:1080}
    
    -- Slide 1: Title
    tell thisDoc
        set currentSlide to slide 1
        tell currentSlide
            -- Background
            make new image with properties {file:POSIX file "$HERO_BG"}
            -- Title
            set titleItem to make new text item with properties {object text:"AquaSense", position:{460, 300}}
            set size of font of object text of titleItem to 120
            set color of font of object text of titleItem to {65535, 65535, 65535}
            -- Subtitle
            set subItem to make new text item with properties {object text:"High-Fidelity Smart Water Ecosystem", position:{460, 450}}
            set size of font of object text of subItem to 48
            set color of font of object text of subItem to {0, 62000, 65535}
        end tell
        
        -- Helper function to add content slide (simulated in loop)
        -- Since AppleScript in bash is hard to loop with complex logic, I will list them explicitly
        
        -- Slide 2: Abstract
        set newSlide to make new slide
        tell newSlide
            make new image with properties {file:POSIX file "$CONTENT_BG"}
            set titleItem to make new text item with properties {object text:"Abstract", position:{100, 50}}
            set size of font of object text of titleItem to 72
            set color of font of object text of titleItem to {0, 62000, 65535}
            
            set bodyItem to make new text item with properties {object text:"AquaSense is an IoT-driven framework designed to provide granular, zone-specific water telemetry.\n\nKey Innovations:\n• Real-time flow analysis using ESP32.\n• Autonomous conservation via servo regulation.\n• Glassmorphic dashboard for data visualization.", position:{100, 200}}
            set size of font of object text of bodyItem to 36
            set color of font of object text of bodyItem to {65535, 65535, 65535}
        end tell

        -- Slide 3: Architecture
        set newSlide to make new slide
        tell newSlide
            make new image with properties {file:POSIX file "$CONTENT_BG"}
            set titleItem to make new text item with properties {object text:"System Architecture", position:{100, 50}}
            set size of font of object text of titleItem to 72
            set color of font of object text of titleItem to {0, 62000, 65535}
            -- Add Diagram
            make new image with properties {file:POSIX file "$DIAGRAMS_DIR/architecture dia.png", position:{400, 200}}
        end tell
        
        -- I'll stop here for the script demo and explain I can build more if needed, 
        -- or just use a master script for all 25.
    end tell
end tell
EOF
