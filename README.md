# Air Quality Monitor

Live readings from my IQAir AirVisual outdoor monitor, hosted on Vercel.

- `index.html` – the page (current US AQI, PM/weather tiles, 48-hour chart, 7-day averages). Refreshes every 5 minutes.
- `api/air.js` – Vercel Function at `/api/air`. Fetches the device feed server-side, trims it, and lets Vercel's CDN cache it for 5 minutes.

## Setup

Set the environment variable `DEVICE_URL` in Vercel (Project → Settings → Environment Variables) to the monitor's device API link from the IQAir dashboard (`https://device.iqair.com/v2/<device-id>`). Keep that link out of the repo — it gives access to the device's data.

Without `DEVICE_URL`, the page falls back to the sample data embedded in `index.html` and shows a notice.
