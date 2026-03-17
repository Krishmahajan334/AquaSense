import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './aquasense.sqlite',
      driver: sqlite3.Database
    });

    // Initialize tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        tank_level REAL,
        input_flow REAL,
        kitchen_flow REAL,
        bathroom_flow REAL,
        drinking_flow REAL,
        plantation_flow REAL
      );

      CREATE TABLE IF NOT EXISTS device_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        system_mode TEXT DEFAULT 'MANUAL', -- AUTO or MANUAL
        kitchen_valve TEXT DEFAULT 'OPEN', -- OPEN or CLOSED
        bathroom_valve TEXT DEFAULT 'OPEN',
        drinking_valve TEXT DEFAULT 'OPEN',
        plantation_valve TEXT DEFAULT 'OPEN'
      );
    `);

    // Insert default state if it doesn't exist
    const state = await db.get('SELECT * FROM device_state WHERE id = 1');
    if (!state) {
      await db.exec(`
        INSERT INTO device_state (id, system_mode, kitchen_valve, bathroom_valve, drinking_valve, plantation_valve)
        VALUES (1, 'MANUAL', 'OPEN', 'OPEN', 'OPEN', 'OPEN')
      `);
    }

    // Insert initial telemetry if empty to prevent empty charts
    const countResponse = await db.get('SELECT COUNT(*) as count FROM telemetry');
    if (countResponse && countResponse.count === 0) {
      await db.exec(`
        INSERT INTO telemetry (tank_level, input_flow, kitchen_flow, bathroom_flow, drinking_flow, plantation_flow)
        VALUES (85.0, 0, 0, 0, 0, 0)
      `);
    }
  }
  return db;
}
