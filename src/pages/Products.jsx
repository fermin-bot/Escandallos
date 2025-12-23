import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { computeRecipeCosts } from '../lib/calculations';
import Semaforo from '../components/Semaforo';
import { useMemo, useState } from 'react';

export default function Products() {
  const { data, role } = useData();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [marginLt, setMarginLt] = useState('');
  const [costGt, setCostGt] = useState('');
  const filtered = useMemo(() => {
    return data.products.filter(p => {
      const c = computeRecipeCosts(p, data.ingredients, data.packaging, data.costs);
      const okQ = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true;
      const okType = type ? p.type === type : true;
      const okMargin = marginLt ? c.marginPct < Number(marginLt) : true;
      const okCost = costGt ? c.unitCost > Number(costGt) : true;
      return okQ && okType && okMargin && okCost;
    });
  }, [data, q, type, marginLt, costGt]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Escandallos</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} className="border rounded px-2 py-1" />
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Todos</option>
          <option value="conserva">Conserva</option>
          <option value="salsa">Salsa</option>
          <option value="mermelada">Mermelada</option>
        </select>
        <input type="number" placeholder="Margen < %" value={marginLt} onChange={e => setMarginLt(e.target.value)} className="border rounded px-2 py-1" />
        <input type="number" placeholder="Coste > €" value={costGt} onChange={e => setCostGt(e.target.value)} className="border rounded px-2 py-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(p => {
          const c = computeRecipeCosts(p, data.ingredients, data.packaging, data.costs);
          return (
            <Link to={`/products/${p.id}`} key={p.id} className="p-3 rounded border hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-zinc-500 capitalize">{p.type} · {p.status}</div>
                </div>
                <Semaforo marginPct={c.marginPct} />
              </div>
              <div className="text-sm mt-2">Coste unitario {c.unitCost.toFixed(3)} € · Margen {c.marginPct.toFixed(1)} %</div>
            </Link>
          );
        })}
      </div>
      {role === 'admin' && (
        <Link to="/products/new" className="inline-block px-3 py-2 rounded bg-blue-600 text-white">Nuevo producto</Link>
      )}
    </div>
  );
}

