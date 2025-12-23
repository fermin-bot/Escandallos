import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { kpis, computeRecipeCosts } from '../lib/calculations';
import { KPICard, MiniBar } from '../components/KPI';

export default function Dashboard() {
  const { data } = useData();
  const stats = kpis(data.products, data.ingredients, data.packaging, data.costs);
  const alerts = [];
  for (const p of data.products) {
    const c = computeRecipeCosts(p, data.ingredients, data.packaging, data.costs);
    if (c.marginPct < 15) alerts.push({ type: 'margen', text: `${p.name} margen bajo 15%` });
  }
  for (const ing of data.ingredients) {
    const last = (ing.priceHistory || []).slice(-1)[0];
    if (last && last.price < ing.price) {
      const pct = ((ing.price - last.price) / last.price) * 100;
      alerts.push({ type: 'precio', text: `${ing.name} subió ${(isFinite(pct) ? pct.toFixed(1) : '0')}%` });
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Coste unitario medio" value={stats.unitCostAvg.toFixed(3)} suffix=" €" />
        <KPICard title="Margen medio" value={stats.marginAvg.toFixed(1)} suffix=" %" />
        <div className="p-4 rounded-lg border bg-white/70 dark:bg-zinc-800/70">
          <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-2">Alertas</div>
          <ul className="space-y-1">
            {alerts.length === 0 && <li className="text-sm text-zinc-500">Sin alertas</li>}
            {alerts.map((a, i) => (
              <li key={i} className="text-sm">
                {a.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium mb-2">Top 5 productos más rentables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.topProfitable.map(t => (
            <MiniBar key={t.id} label={t.name} percent={t.marginPct} />
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <Link to="/products" className="px-3 py-2 rounded bg-blue-600 text-white">Escandallos</Link>
        <Link to="/masters" className="px-3 py-2 rounded bg-zinc-600 text-white">Maestros</Link>
        <Link to="/simulator" className="px-3 py-2 rounded bg-emerald-600 text-white">Simulador</Link>
      </div>
    </div>
  );
}

