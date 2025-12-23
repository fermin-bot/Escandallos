import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import { computeRecipeCosts } from '../lib/calculations';

function Row({ label, va, vb }) {
  const max = Math.max(va || 0, vb || 0, 1);
  return (
    <tr className="border-t">
      <td className="text-sm">{label}</td>
      <td className="text-sm">
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded">
          <div className="h-2 bg-blue-600 rounded" style={{ width: `${(va / max) * 100}%` }} />
        </div>
        <div className="text-xs">{va?.toFixed(2)} €</div>
      </td>
      <td className="text-sm">
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded">
          <div className="h-2 bg-emerald-600 rounded" style={{ width: `${(vb / max) * 100}%` }} />
        </div>
        <div className="text-xs">{vb?.toFixed(2)} €</div>
      </td>
    </tr>
  );
}

export default function Comparator() {
  const { data } = useData();
  const [a, setA] = useState(data.products[0]?.id || '');
  const [b, setB] = useState(data.products[1]?.id || '');
  const pa = useMemo(() => data.products.find(p => p.id === a), [a, data.products]);
  const pb = useMemo(() => data.products.find(p => p.id === b), [b, data.products]);
  const ca = pa ? computeRecipeCosts(pa, data.ingredients, data.packaging, data.costs) : null;
  const cb = pb ? computeRecipeCosts(pb, data.ingredients, data.packaging, data.costs) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Comparador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select className="border rounded px-2 py-1" value={a} onChange={e => setA(e.target.value)}>
          {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={b} onChange={e => setB(e.target.value)}>
          {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {ca && cb && (
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th></th><th>{pa.name}</th><th>{pb.name}</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Materia prima" va={ca.materiaPrima} vb={cb.materiaPrima} />
            <Row label="Envase" va={ca.envase} vb={cb.envase} />
            <Row label="Mano de obra" va={ca.labor} vb={cb.labor} />
            <Row label="Energía" va={ca.energy} vb={cb.energy} />
            <Row label="Agua" va={ca.water} vb={cb.water} />
            <Row label="Maquinaria" va={ca.machinery} vb={cb.machinery} />
            <Row label="Gastos generales" va={ca.overhead} vb={cb.overhead} />
            <Row label="Coste total lote" va={ca.totalLote} vb={cb.totalLote} />
            <Row label="Coste unitario" va={ca.unitCost} vb={cb.unitCost} />
            <tr className="border-t">
              <td className="text-sm">Margen %</td>
              <td className="text-sm">{ca.marginPct.toFixed(1)} %</td>
              <td className="text-sm">{cb.marginPct.toFixed(1)} %</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

