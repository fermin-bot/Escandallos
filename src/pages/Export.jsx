import { useData } from '../context/DataContext';
import { exportData } from '../lib/storage';
import { useMemo, useState } from 'react';
import { computeRecipeCosts } from '../lib/calculations';

function toCSV(rows) {
  const header = Object.keys(rows[0]);
  const lines = [header.join(',')].concat(rows.map(r => header.map(k => r[k]).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'escandallos.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Export() {
  const { data } = useData();
  const [selected, setSelected] = useState(data.products[0]?.id || '');
  const product = useMemo(() => data.products.find(p => p.id === selected), [selected, data.products]);
  const c = product ? computeRecipeCosts(product, data.ingredients, data.packaging, data.costs) : null;

  function exportListCSV() {
    const rows = data.products.map(p => {
      const cp = computeRecipeCosts(p, data.ingredients, data.packaging, data.costs);
      return { id: p.id, name: p.name, type: p.type, unitCost: cp.unitCost.toFixed(3), marginPct: cp.marginPct.toFixed(1) };
    });
    toCSV(rows);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Exportación</h1>
      <div className="flex gap-3">
        <button className="px-3 py-2 rounded bg-zinc-700 text-white" onClick={exportData}>Exportar datos JSON</button>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={exportListCSV}>Exportar listado CSV</button>
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Escandallo para imprimir</label>
        <select className="border rounded px-2 py-1" value={selected} onChange={e => setSelected(e.target.value)}>
          {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {product && c && (
          <div className="p-4 rounded border">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">{product.name}</div>
              <button className="px-3 py-2 rounded bg-zinc-800 text-white" onClick={() => window.print()}>Imprimir</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <div className="font-medium mb-2">Receta</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left"><th>Tipo</th><th>Referencia</th><th>Cantidad</th><th>Unidad</th></tr>
                  </thead>
                  <tbody>
                    {product.recipeLines.map((l, i) => (
                      <tr key={i} className="border-t">
                        <td className="capitalize">{l.type}</td><td>{l.refId}</td><td>{l.quantity}</td><td>{l.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div className="font-medium mb-2">Costes</div>
                <div className="text-sm space-y-1">
                  <div>Materia prima: {c.materiaPrima.toFixed(2)} €</div>
                  <div>Envase: {c.envase.toFixed(2)} €</div>
                  <div>Mano de obra: {c.labor.toFixed(2)} €</div>
                  <div>Energía: {c.energy.toFixed(2)} €</div>
                  <div>Agua: {c.water.toFixed(2)} €</div>
                  <div>Maquinaria: {c.machinery.toFixed(2)} €</div>
                  <div>Gastos generales: {c.overhead.toFixed(2)} €</div>
                  <div className="font-medium">Coste total lote: {c.totalLote.toFixed(2)} €</div>
                  <div className="font-medium">Coste unitario: {c.unitCost.toFixed(3)} €</div>
                  <div className="font-medium">Precio venta: {c.unitPrice.toFixed(3)} €</div>
                  <div className="font-medium">Margen %: {c.marginPct.toFixed(1)} %</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

