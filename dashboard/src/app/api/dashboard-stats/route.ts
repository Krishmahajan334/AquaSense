import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();

    // Get the most recent 50 telemetry records
    const telemetry = await db.all(
      'SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 50'
    );
    // Reverse to show chronologically left-to-right on charts
    const chartData = telemetry.reverse();

    // Get current device state
    const state = await db.get('SELECT * FROM device_state WHERE id = 1');

    return NextResponse.json({
      chartData,
      state
    });
  } catch (error) {
    console.error('API Error /dashboard-stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
