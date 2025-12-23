import { useState } from 'react';
import { useData } from '../context/DataContext';

function NumberInput({ value, onChange, min = 0, step = 0.01, disabled = false }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      disabled={disabled}
      onChange={e => onChange(Number(e.target.value))}
      className="border rounded px-2 py-1 w-full"
    />
  );
}

export default function Masters() {
  const { data, upsertItem, deleteItem, role } = useData();
  const [tab, setTab] = useState('ingredientes');
  const canEdit = role === 'admin';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Maestros</h1>
      <div className="flex gap-2">
        {['ingredientes', 'envases', 'costes'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded ${tab === t ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'ingredientes' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>Nombre</th><th>Proveedor</th><th>Unidad</th><th>Precio</th><th>IVA</th><th>Alérgenos</th><th>Categoría</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.ingredients.map(i => (
                <tr key={i.id} className="border-t">
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.name} onChange={e => upsertItem('ingredients', { ...i, name: e.target.value })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.supplier} onChange={e => upsertItem('ingredients', { ...i, supplier: e.target.value })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.unit} onChange={e => upsertItem('ingredients', { ...i, unit: e.target.value })} /></td>
                  <td>
                    <NumberInput
                      disabled={!canEdit}
                      value={i.price}
                      onChange={v => {
                        const nextPrice = Math.max(0, v);
                        if (nextPrice === i.price) return;
                        const hist = Array.isArray(i.priceHistory) ? [...i.priceHistory] : [];
                        hist.push({ date: new Date().toISOString(), price: i.price });
                        while (hist.length > 5) hist.shift();
                        upsertItem('ingredients', { ...i, price: nextPrice, priceHistory: hist });
                      }}
                    />
                  </td>
                  <td><NumberInput disabled={!canEdit} value={i.vat} onChange={v => upsertItem('ingredients', { ...i, vat: Math.max(0, v) })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={(i.allergens || []).join(', ')} onChange={e => upsertItem('ingredients', { ...i, allergens: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.category} onChange={e => upsertItem('ingredients', { ...i, category: e.target.value })} /></td>
                  <td>
                    {canEdit && <button className="text-red-600" onClick={() => { if (confirm('¿Eliminar ingrediente?')) deleteItem('ingredients', i.id); }}>Eliminar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'envases' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>Nombre</th><th>Unidad</th><th>Precio</th><th>Proveedor</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.packaging.map(i => (
                <tr key={i.id} className="border-t">
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.name} onChange={e => upsertItem('packaging', { ...i, name: e.target.value })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.unit} onChange={e => upsertItem('packaging', { ...i, unit: e.target.value })} /></td>
                  <td><NumberInput disabled={!canEdit} value={i.price} onChange={v => upsertItem('packaging', { ...i, price: Math.max(0, v) })} /></td>
                  <td><input disabled={!canEdit} className="w-full px-2 py-1 border rounded" value={i.supplier} onChange={e => upsertItem('packaging', { ...i, supplier: e.target.value })} /></td>
                  <td>
                    {canEdit && <button className="text-red-600" onClick={() => { if (confirm('¿Eliminar envase?')) deleteItem('packaging', i.id); }}>Eliminar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'costes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm">Coste hora operario</label>
            <NumberInput disabled={!canEdit} value={data.costs.laborHourCost} onChange={v => upsertItem('costs', { ...data.costs, laborHourCost: Math.max(0, v) })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Coste energía por hora</label>
            <NumberInput disabled={!canEdit} value={data.costs.energyHourCost} onChange={v => upsertItem('costs', { ...data.costs, energyHourCost: Math.max(0, v) })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Coste agua por lote</label>
            <NumberInput disabled={!canEdit} value={data.costs.waterPerBatchCost} onChange={v => upsertItem('costs', { ...data.costs, waterPerBatchCost: Math.max(0, v) })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Gastos generales</label>
            <div className="flex gap-2">
              <select disabled={!canEdit} className="border rounded px-2 py-1" value={data.costs.overhead.mode} onChange={e => upsertItem('costs', { ...data.costs, overhead: { ...data.costs.overhead, mode: e.target.value } })}>
                <option value="percent">% sobre coste</option>
                <option value="fixed">€/lote fijo</option>
              </select>
              <NumberInput disabled={!canEdit} value={data.costs.overhead.value} onChange={v => upsertItem('costs', { ...data.costs, overhead: { ...data.costs.overhead, value: Math.max(0, v) } })} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
