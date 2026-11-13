// Vercel Function: fetches your IQAir device feed server-side, trims it,
// and lets Vercel's CDN cache it for 5 minutes. Served at /api/air.
// Set DEVICE_URL in Project Settings → Environment Variables
// to your full link: https://device.iqair.com/v2/<your-id>

export async function GET() {
  const deviceUrl = process.env.DEVICE_URL;
  if (!deviceUrl) return json({ error: "DEVICE_URL not set" }, 500, 0);

  let upstream;
  try {
    upstream = await fetch(deviceUrl, { headers: { Accept: "application/json" } });
  } catch {
    return json({ error: "device_unreachable" }, 502, 0);
  }
  if (!upstream.ok) return json({ error: "device_error", status: upstream.status }, 502, 0);

  const d = await upstream.json();
  return json(
    {
      name: d.name,
      current: d.current,
      hourly: d.historical?.hourly ?? [],
      daily: d.historical?.daily ?? [],
    },
    200,
    300
  );
}

function json(obj, status, maxAge) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      // Browsers re-check every time; Vercel's edge cache serves it for maxAge seconds.
      "Cache-Control": maxAge
        ? `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=60`
        : "no-store",
    },
  });
}
