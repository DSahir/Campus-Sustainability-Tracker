import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const endpointCards = [
  { title: "Buildings", path: "/buildings" },
  { title: "Metrics Summary", path: "/metrics/summary" },
  { title: "Alerts", path: "/alerts" },
  { title: "Prediction", path: "/predict" },
  { title: "Reports", path: "/reports" },
  { title: "Recommendations", path: "/recommendations" },
  { title: "Thresholds", path: "/settings/thresholds" },
];

export default function App() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function loadSummary() {
      const response = await fetch(`${API_BASE_URL}/metrics/summary`);
      const data = await response.json();
      setSummary(data);
    }

    loadSummary().catch(() => {
      setSummary({
        campus: "Unavailable",
        trend: "error",
        energy_kwh: 0,
        water_gallons: 0,
        waste_kg: 0,
        co2_tons: 0,
      });
    });
  }, []);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Campus Sustainability Tracker</p>
        <h1>React frontend scaffold connected to FastAPI stub services.</h1>
        <p className="lede">
          This placeholder UI shows the intended frontend layer and the API surface
          that the dashboard will consume next.
        </p>
      </section>

      <section className="summary-card">
        <h2>Current Summary</h2>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
      </section>

      <section className="endpoint-grid">
        {endpointCards.map((card) => (
          <article key={card.path} className="endpoint-card">
            <h3>{card.title}</h3>
            <p>{`${API_BASE_URL}${card.path}`}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
