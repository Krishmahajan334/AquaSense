import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await getDb();

    const {
      tank_level,
      input_flow,
      kitchen_flow,
      bathroom_flow,
      drinking_flow,
      plantation_flow
    } = data;

    // Handle auto-mode override
    const state = await db.get('SELECT * FROM device_state WHERE id = 1');
    if (state && state.system_mode === 'AUTO') {
      // If tank level is low (< 10%), shut off non-essential valves
      if (tank_level < 10 && state.plantation_valve === 'OPEN') {
        await db.run(
          'UPDATE device_state SET plantation_valve = ? WHERE id = 1',
          ['CLOSED']
        );
      }
    }

    const stmt = await db.prepare(`
      INSERT INTO telemetry (
        tank_level, input_flow, kitchen_flow, bathroom_flow, drinking_flow, plantation_flow
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.run([
      tank_level ?? 0,
      input_flow ?? 0,
      kitchen_flow ?? 0,
      bathroom_flow ?? 0,
      drinking_flow ?? 0,
      plantation_flow ?? 0
    ]);
    
    await stmt.finalize();

    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('API Error /sensor-data:', error);
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}
