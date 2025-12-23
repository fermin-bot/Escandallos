import { useData } from '../context/DataContext';
import { useMemo, useState } from 'react';
import { computeRecipeCosts } from '../lib/calculations';

export default function Simulator() {
  const { data } = useData();
  const [productId, setProductId] = useState(data.products[0]?.id || '');
  const [ingId, setIngId] = useState(data.ingredients[0]?.id || '');
  const [ingPct, setIngPct] = useState(0);
  const [wastePct, setWastePct] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const baseProduct = useMemo(() => data.products.find(p => p.id === productId), [productId, data.products]);
  const simulated = useMemo(() => {
    if (!baseProduct) return null;
    const next = JSON.parse(JSON.stringify(baseProduct));
    if (wastePct !== null) next.process.wastePct = Math.max(0, Math.min(50, wastePct));
    if (salePrice !== null) next.pricing.unitSalePrice = Math.max(0, salePrice);
    if (ingPct !== 0 && ingId) {
      const ing = data.ingredients.find(i => i.id === ingId);
      if (ing) {
        const updated = { ...ing, price: ing.price * (1 + ingPct / 100) };
        const ingredients = data.ingredients.map(i => i.id === ingId ? updated : i);
        return { next, ingredients };
      }
    }
    return { next, ingredients: data.ingredients };
  }, [baseProduct, ingPct, ingId, wastePct, salePrice, data.ingredients]);

  if (!baseProduct) return null;
  const base = computeRecipeCosts(baseProduct, data.ingredients, data.packaging, data.costs);
  const sim = simulated ? computeRecipeCosts(simulated.next, simulated.ingredients, data.packaging, data.costs) : base;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Simulador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select className="border rounded px-2 py-1" value={productId} onChange={e => setProductId(e.target.value)}>
          {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="space-y-1">
          <label className="block text-sm">Ingrediente</label>
          <select className="border rounded px-2 py-1" value={ingId} onChange={e => setIngId(e.target.value)}>
            {data.ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input type="number" className="border rounded px-2 py-1 w-full" placeholder="% cambio precio" value={ingPct} onChange={e => setIngPct(Number(e.target.value))} />
        </div>
        <input type="number" className="border rounded px-2 py-1" placeholder="Merma %" value={wastePct ?? ''} onChange={e => setWastePct(Number(e.target.value))} />
        <input type="number" className="border rounded px-2 py-1" placeholder="Precio venta unitario" value={salePrice ?? ''} onChange={e => setSalePrice(Number(e.target.value))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border">
          <div className="font-medium mb-2">Base</div>
          <div className="text-sm space-y-1">
            <div>Coste unitario: {base.unitCost.toFixed(3)} €</div>
            <div>Margen %: {base.marginPct.toFixed(1)} %</div>
          </div>
        </div>
        <div className="p-4 rounded border">
          <div className="font-medium mb-2">Simulado</div>
          <div className="text-sm space-y-1">
            <div>Coste unitario: {sim.unitCost.toFixed(3)} €</div>
            <div>Margen %: {sim.marginPct.toFixed(1)} %</div>
          </div>
        </div>
      </div>
    </div>
  );
}

