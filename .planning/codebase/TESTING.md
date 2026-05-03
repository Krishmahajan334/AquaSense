# Testing Strategy

## Automated Testing
- **Backend:** Flask unit tests (to be implemented or verified in `.planning/`).
- **Frontend:** Manual visual regression and browser console debugging.
- **Hardware:** Logic verification in `simulator.cpp`.

## Manual Verification (UAT)
- **Telemetry Loop:** Verify that simulator values appear on the Dashboard within 5 seconds.
- **Control Loop:** Verify that toggling a valve on the Admin panel updates the simulator state.
- **Telegram Bot:** Verify `/report` returns the current live statistics accurately.

## Verification Tools
- Browser DevTools (Network/Console).
- `curl` for API endpoint testing.
- Simulator logs for telemetry validation.
