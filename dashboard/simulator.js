// Configuration
const API_URL = 'http://127.0.0.1:3000/api';
const INTERVAL_MS = 2000;

let currentTankLevel = 85.0;

function getRandomFlow(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

async function runSimulator() {
  console.log('💧 AquaSense Data Simulator Started...');

  setInterval(async () => {
    try {
      // 1. Fetch current valve state
      let state;
      try {
        const res = await fetch(`${API_URL}/dashboard-stats`);
        const data = await res.json();
        state = data.state;
      } catch (e) {
        console.log('Waiting for Next.js server to start...');
        return;
      }

      if (!state) return;

      // 2. Generate Simulated Flow based on Valve States
      const inputFlow = getRandomFlow(10, 15); // Main supply is always on for this simulation
      
      const kitchenFlow = state.kitchen_valve === 'OPEN' ? getRandomFlow(2, 5) : 0;
      const bathroomFlow = state.bathroom_valve === 'OPEN' ? getRandomFlow(4, 8) : 0;
      const drinkingFlow = state.drinking_valve === 'OPEN' ? getRandomFlow(0.5, 1.5) : 0;
      const plantationFlow = state.plantation_valve === 'OPEN' ? getRandomFlow(3, 6) : 0;

      const totalOutput = kitchenFlow + bathroomFlow + drinkingFlow + plantationFlow;

      // 3. Calculate new Tank Level
      // Add input, subtract output. Adjust scales for visual effect.
      const netChange = (inputFlow - totalOutput) * 0.1; 
      currentTankLevel = Math.min(100, Math.max(0, currentTankLevel + netChange));

      // 4. Send Telemetry to API
      const payload = {
        tank_level: Number(currentTankLevel.toFixed(1)),
        input_flow: inputFlow,
        kitchen_flow: kitchenFlow,
        bathroom_flow: bathroomFlow,
        drinking_flow: drinkingFlow,
        plantation_flow: plantationFlow
      };

      await fetch(`${API_URL}/sensor-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(res => res.json()).then(data => {
        if(data.error) console.error("Telemetry Error:", data.error);
      });

      console.log(`Sent -> Tank: ${payload.tank_level}% | Input: ${payload.input_flow} | Out: ${totalOutput.toFixed(2)}`);

    } catch (error) {
      console.error('Simulation Error:', error.message);
    }
  }, INTERVAL_MS);
}

runSimulator();
