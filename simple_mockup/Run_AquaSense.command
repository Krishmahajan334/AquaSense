#!/bin/bash
# Move to the project directory
cd "$(dirname "$0")"

echo "🚀 Starting AquaSense Project..."

# 1. Compile the simulator
echo "🔨 Compiling simulator..."
g++ hardware_sim/simulator.cpp -o hardware_sim/sim -std=c++11

# 2. Start the Flask Server in a new window
echo "🌐 Starting Backend Server..."
osascript -e "tell app \"Terminal\" to do script \"cd '$PWD' && python3 backend/server.py\""

# 3. Start the Simulator in a new window
echo "📟 Starting Hardware Simulator..."
osascript -e "tell app \"Terminal\" to do script \"cd '$PWD' && ./hardware_sim/sim\""

# 4. Open the Dashboard in the browser
echo "🌐 Opening dashboard..."
sleep 3
open http://localhost:5050

echo "✅ All components are running! Check the new terminal windows for logs."
