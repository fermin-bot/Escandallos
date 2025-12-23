import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import { computeRecipeCosts, allergensForProduct } from '../lib/calculations';

function NumberInput({ value, onChange, min = 0, step = 0.01 }) {
  return <input type="number" value={value} min={min} step={step} onChange={e => onChange(Number(e.target.value))} className="border rounded px-2 py-1 w-full" />;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data, upsertItem, role } = useData();
  const product = useMemo(() => data.products.find(p => p.id === id) || {
    id,
    name: 'Nuevo producto',
    type: 'conserva',
    status: 'borrador',
    recipeLines: [],
    process: { batchSize: 0, wastePct: 0, productionTimeMin: 0, workers: 0, machineryCostHour: 0, extra: { pasteurization: false, extraTimeMin: 0 } },
    pricing: { unitSalePrice: 0 },
  }, [data.products, id]);
  const [tab, setTab] = useState('bom');
  const canEdit = role === 'admin';
  const c = computeRecipeCosts(product, data.ingredients, data.packaging, data.costs);
  const allergens = allergensForProduct(product, data.ingredients);

  function updateProduct(next) {
    upsertItem('products', next);
  }

  function addLine(type) {
    updateProduct({ ...product, recipeLines: [...product.recipeLines, { type, refId: '', quantity: 0, unit: '' }] });
  }

  function updateLine(index, next) {
    const lines = [...product.recipeLines];
    lines[index] = next;
    updateProduct({ ...product, recipeLines: lines });
  }

  function deleteLine(index) {
    const lines = product.recipeLines.filter((_, i) => i !== index);
    updateProduct({ ...product, recipeLines: lines });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-2">
          <select disabled={!canEdit} className="border rounded px-2 py-1" value={product.status} onChange={e => updateProduct({ ...product, status: e.target.value })}>
            <option value="borrador">Borrador</option>
            <option value="aprobado">Aprobado</option>
          </select>
          <select disabled={!canEdit} className="border rounded px-2 py-1" value={product.type} onChange={e => updateProduct({ ...product, type: e.target.value })}>
            <option value="conserva">Conserva</option>
            <option value="salsa">Salsa</option>
            <option value="mermelada">Mermelada</option>
          </select>
        </div>
      </div>
      {allergens.length > 0 && (
        <div className="text-sm text-red-600">Alérgenos: {allergens.join(', ')}</div>
      )}
      <div className="flex gap-2">
        {[
          { key: 'bom', label: 'Receta / BOM' },
          { key: 'proceso', label: 'Proceso' },
          { key: 'costes', label: 'Costes y precios' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 rounded ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bom' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button disabled={!canEdit} className="px-3 py-2 rounded bg-emerald-600 text-white" onClick={() => addLine('ingredient')}>Añadir ingrediente</button>
            <button disabled={!canEdit} className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={() => addLine('packaging')}>Añadir envase</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th>Tipo</th><th>Referencia</th><th>Cantidad</th><th>Unidad</th><th>Coste línea</th><th></th>
                </tr>
              </thead>
              <tbody>
                {product.recipeLines.map((line, i) => {
                  const refList = line.type === 'ingredient' ? data.ingredients : data.packaging;
                  const costLine = computeRecipeCosts({ ...product, recipeLines: [line], process: { wastePct: product.process?.wastePct || 0 } }, data.ingredients, data.packaging, data.costs).materiaPrima + computeRecipeCosts({ ...product, recipeLines: [line] }, data.ingredients, data.packaging, data.costs).envase;
                  return (
                    <tr key={i} className="border-t">
                      <td className="capitalize">{line.type}</td>
                      <td>
                        <select disabled={!canEdit} className="border rounded px-2 py-1 w-full" value={line.refId} onChange={e => updateLine(i, { ...line, refId: e.target.value })}>
                          <option value="">Seleccionar</option>
                          {refList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </td>
                      <td><NumberInput value={line.quantity} onChange={v => updateLine(i, { ...line, quantity: Math.max(0, v) })} /></td>
                      <td><input disabled={!canEdit} className="border rounded px-2 py-1 w-full" value={line.unit} onChange={e => updateLine(i, { ...line, unit: e.target.value })} /></td>
                      <td>{costLine.toFixed(3)} €</td>
                      <td>
                        {canEdit && <button className="text-red-600" onClick={() => { if (confirm('¿Eliminar línea?')) deleteLine(i); }}>Eliminar</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'proceso' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm">Tamaño de lote (unidades)</label>
            <NumberInput value={product.process.batchSize} onChange={v => updateProduct({ ...product, process: { ...product.process, batchSize: Math.max(0, v) } })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Merma %</label>
            <NumberInput value={product.process.wastePct} onChange={v => updateProduct({ ...product, process: { ...product.process, wastePct: Math.max(0, Math.min(50, v)) } })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Tiempo de producción (min)</label>
            <NumberInput value={product.process.productionTimeMin} onChange={v => updateProduct({ ...product, process: { ...product.process, productionTimeMin: Math.max(0, v) } })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Operarios (n)</label>
            <NumberInput value={product.process.workers} onChange={v => updateProduct({ ...product, process: { ...product.process, workers: Math.max(0, v) } })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Maquinaria: coste/hora</label>
            <NumberInput value={product.process.machineryCostHour} onChange={v => updateProduct({ ...product, process: { ...product.process, machineryCostHour: Math.max(0, v) } })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Pasteurización/Esterilización</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={product.process.extra.pasteurization} onChange={e => updateProduct({ ...product, process: { ...product.process, extra: { ...product.process.extra, pasteurization: e.target.checked } } })} />
              <span>Aplicar</span>
            </div>
            <label className="block text-sm">Tiempo extra (min)</label>
            <NumberInput value={product.process.extra.extraTimeMin} onChange={v => updateProduct({ ...product, process: { ...product.process, extra: { ...product.process.extra, extraTimeMin: Math.max(0, v) } } })} />
          </div>
        </div>
      )}

      {tab === 'costes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded border">
            <div className="space-y-1 text-sm">
              <div>Materia prima: {c.materiaPrima.toFixed(2)} €</div>
              <div>Envase: {c.envase.toFixed(2)} €</div>
              <div>Mano de obra: {c.labor.toFixed(2)} €</div>
              <div>Energía: {c.energy.toFixed(2)} €</div>
              <div>Agua: {c.water.toFixed(2)} €</div>
              <div>Maquinaria: {c.machinery.toFixed(2)} €</div>
              <div>Gastos generales: {c.overhead.toFixed(2)} €</div>
              <div className="font-medium">Coste total lote: {c.totalLote.toFixed(2)} €</div>
              <div className="font-medium">Coste unitario: {c.unitCost.toFixed(3)} €</div>
            </div>
          </div>
          <div className="p-4 rounded border space-y-2">
            <label className="block text-sm">Precio venta unitario</label>
            <NumberInput value={product.pricing.unitSalePrice} onChange={v => upsertItem('products', { ...product, pricing: { unitSalePrice: Math.max(0, v) } })} />
            <div className="text-sm">
              Margen €: {c.marginEur.toFixed(3)} · Margen %: {c.marginPct.toFixed(1)} %
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

