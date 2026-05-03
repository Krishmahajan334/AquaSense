# Technical Concerns & Risks

## Security
- **Authentication:** The current system lacks a robust authentication layer for the Admin Panel.
- **Bot Safety:** Commands are processed without user-ID verification (potential risk if bot link is shared).

## Reliability
- **State Sync:** Potential race conditions between Local CSV caching and Firestore updates.
- **Simulator Crashes:** If the C++ simulator dies, the dashboard will show stale data without a clear error state.

## Scalability
- **Polling Frequency:** Constant polling from the frontend might strain the Flask server as the number of clients grows.
- **Database Limits:** Firestore write frequency needs monitoring to stay within free tier limits during simulation.

## Technical Debt
- **Documentation:** Many scripts (`create_keynote.sh`, `gen_keynote_script.py`) are legacy/one-off and not integrated into the main app lifecycle.
- **Error Handling:** Frontend error boundaries are minimal; API failures may result in silent UI "stuck" states.
