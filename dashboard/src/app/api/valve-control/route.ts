import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const db = await getDb();

    // allowed fields to update
    const validFields = [
      'system_mode',
      'kitchen_valve',
      'bathroom_valve',
      'drinking_valve',
      'plantation_valve'
    ];

    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (validFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length > 0) {
      const query = `UPDATE device_state SET ${updates.join(', ')} WHERE id = 1`;
      await db.run(query, values);
    }

    const newState = await db.get('SELECT * FROM device_state WHERE id = 1');
    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error('API Error /valve-control:', error);
    return NextResponse.json({ error: 'Failed to control valve' }, { status: 500 });
  }
}
