"use client";

import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FaWater, FaFaucet, FaShower, FaGlassWhiskey, FaLeaf, FaCubes } from 'react-icons/fa';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [state, setState] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard-stats');
      const json = await res.json();
      if (json.chartData) setData(json.chartData);
      if (json.state) setState(json.state);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleValve = async (valveName: string, currentValue: string) => {
    const newValue = currentValue === 'OPEN' ? 'CLOSED' : 'OPEN';
    await fetch('/api/valve-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [valveName]: newValue })
    });
    fetchData();
  };

  const toggleMode = async () => {
    const newMode = state?.system_mode === 'AUTO' ? 'MANUAL' : 'AUTO';
    await fetch('/api/valve-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_mode: newMode })
    });
    fetchData();
  };

  if (!state) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const currentLevel = data.length > 0 ? data[data.length - 1].tank_level : 0;
  const currentInput = data.length > 0 ? data[data.length - 1].input_flow : 0;
  
  // Calculate total consumed output
  const currentOutput = data.length > 0 ? 
    (data[data.length - 1].kitchen_flow + 
     data[data.length - 1].bathroom_flow + 
     data[data.length - 1].drinking_flow + 
     data[data.length - 1].plantation_flow) : 0;

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 glow-text flex items-center gap-3">
            <FaWater className="text-blue-500" /> AquaSense
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Smart Water Monitoring System Mockup</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full border ${state.system_mode === 'AUTO' ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-slate-500 text-slate-300 bg-slate-800/50'} transition-all`}>
            {state.system_mode} MODE
          </div>
          <button 
            onClick={toggleMode}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg shadow-blue-500/30 font-medium"
          >
            Toggle Mode
          </button>
        </div>
      </header>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tank Visualization */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-200">
            <FaCubes /> Main Storage Tank
          </h2>
          <div className="relative w-48 h-64 border-4 border-slate-700 rounded-b-3xl rounded-t-lg overflow-hidden bg-slate-900/50 shadow-inner">
            {/* Water Fill */}
            <div 
              className="absolute bottom-0 w-full water-wave"
              style={{ height: `${currentLevel}%` }}
            />
            {/* Percentage Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 transition-all">
              <span className="text-3xl font-bold text-white drop-shadow-lg break-words w-full text-center">
                {currentLevel.toFixed(1)}%
              </span>
            </div>
            {/* Threshold Marks */}
            <div className="absolute top-[90%] w-full border-t border-red-500/50 border-dashed z-0"></div>
          </div>
          <p className={`mt-4 font-medium ${currentLevel < 15 ? 'text-red-400 animated-pulse' : 'text-green-400'}`}>
            {currentLevel < 15 ? 'Critical Level Warning' : 'Level Normal'}
          </p>
        </div>

        {/* System Overview Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-sm mb-1">Input Flow Rate</p>
              <h3 className="text-4xl font-bold text-blue-400">{currentInput.toFixed(2)} <span className="text-lg text-slate-500">L/min</span></h3>
            </div>
            <div className="mt-4 h-32 min-h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line type="monotone" dataKey="input_flow" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-sm mb-1">Total Consumption Output</p>
              <h3 className="text-4xl font-bold text-cyan-400">{currentOutput.toFixed(2)} <span className="text-lg text-slate-500">L/min</span></h3>
            </div>
            <div className="mt-4 h-32 min-h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.map(d => ({ 
                  ...d, 
                  total_out: d.kitchen_flow + d.bathroom_flow + d.drinking_flow + d.plantation_flow 
                }))}>
                  <Line type="monotone" dataKey="total_out" stroke="#06b6d4" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Control Panel & Area wise breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Valve Controls */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-200">Distribution Nodes Control</h2>
          <div className="space-y-4">
            <ValveControlRow 
              icon={<FaFaucet />} name="Kitchen" dbKey="kitchen_valve" 
              state={state.kitchen_valve} onToggle={() => toggleValve('kitchen_valve', state.kitchen_valve)} 
              disabled={state.system_mode === 'AUTO'}
            />
            <ValveControlRow 
              icon={<FaShower />} name="Bathroom" dbKey="bathroom_valve" 
              state={state.bathroom_valve} onToggle={() => toggleValve('bathroom_valve', state.bathroom_valve)} 
              disabled={state.system_mode === 'AUTO'}
            />
            <ValveControlRow 
              icon={<FaGlassWhiskey />} name="Drinking Station" dbKey="drinking_valve" 
              state={state.drinking_valve} onToggle={() => toggleValve('drinking_valve', state.drinking_valve)} 
              disabled={state.system_mode === 'AUTO'}
            />
            <ValveControlRow 
              icon={<FaLeaf />} name="Plantation Lines" dbKey="plantation_valve" 
              state={state.plantation_valve} onToggle={() => toggleValve('plantation_valve', state.plantation_valve)} 
              disabled={state.system_mode === 'AUTO'}
            />
          </div>
        </div>

        {/* Detailed Chart */}
        <div className="glass-panel p-6">
           <h2 className="text-xl font-semibold mb-6 text-blue-200">Area-wise Consumption Graph</h2>
           <div className="h-[300px] w-full min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="timestamp" hide />
                 <YAxis stroke="#94a3b8" />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                   itemStyle={{ color: '#e2e8f0' }}
                 />
                 <Legend />
                 <Line type="monotone" dataKey="kitchen_flow" name="Kitchen" stroke="#f59e0b" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="bathroom_flow" name="Bathroom" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="drinking_flow" name="Drinking" stroke="#ec4899" strokeWidth={2} dot={false} />
                 <Line type="monotone" dataKey="plantation_flow" name="Plantation" stroke="#10b981" strokeWidth={2} dot={false} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>

      </div>
    </div>
  );
}

function ValveControlRow({ icon, name, state, onToggle, disabled }: any) {
  const isOpen = state === 'OPEN';
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-slate-200">{name}</h4>
          <p className="text-sm text-slate-500">Status: {state}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${isOpen ? 'bg-blue-500' : 'bg-slate-600'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-8' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
