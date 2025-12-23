function resolvePrice(line, ingredients, packaging) {
  if (line.type === 'ingredient') {
    const ing = ingredients.find(i => i.id === line.refId);
    return ing ? ing.price : 0;
  }
  const env = packaging.find(e => e.id === line.refId);
  return env ? env.price : 0;
}

export function computeLineCost(line, ingredients, packaging) {
  const unitPrice = resolvePrice(line, ingredients, packaging);
  return (line.quantity || 0) * unitPrice;
}

export function computeRecipeCosts(product, ingredients, packaging, costs) {
  const wasteFactor = 1 / (1 - (product.process?.wastePct || 0) / 100);
  let materiaPrima = 0;
  let envase = 0;
  for (const line of product.recipeLines || []) {
    const base = computeLineCost(line, ingredients, packaging);
    if (line.type === 'ingredient') materiaPrima += base * wasteFactor;
    else envase += base;
  }
  const timeMin = (product.process?.productionTimeMin || 0) + (product.process?.extra?.extraTimeMin || 0);
  const labor = (timeMin / 60) * (product.process?.workers || 0) * (costs.laborHourCost || 0);
  const machinery = (timeMin / 60) * (product.process?.machineryCostHour || 0);
  const energy = (timeMin / 60) * (costs.energyHourCost || 0);
  const water = costs.waterPerBatchCost || 0;
  const baseForOverhead = materiaPrima + envase + labor + energy + water + machinery;
  const overhead = costs.overhead?.mode === 'fixed'
    ? (costs.overhead?.value || 0)
    : baseForOverhead * ((costs.overhead?.value || 0) / 100);
  const totalLote = baseForOverhead + overhead;
  const unidades = product.process?.batchSize || 0;
  const unitCost = unidades > 0 ? totalLote / unidades : 0;
  const unitPrice = product.pricing?.unitSalePrice || 0;
  const marginEur = unitPrice - unitCost;
  const marginPct = unitPrice > 0 ? (marginEur / unitPrice) * 100 : 0;
  return {
    materiaPrima,
    envase,
    labor,
    machinery,
    energy,
    water,
    overhead,
    totalLote,
    unitCost,
    unitPrice,
    marginEur,
    marginPct,
  };
}

export function allergensForProduct(product, ingredients) {
  const set = new Set();
  for (const line of product.recipeLines || []) {
    if (line.type !== 'ingredient') continue;
    const ing = ingredients.find(i => i.id === line.refId);
    (ing?.allergens || []).forEach(a => set.add(a));
  }
  return Array.from(set);
}

export function kpis(products, ingredients, packaging, costs) {
  const computed = products.map(p => ({ p, c: computeRecipeCosts(p, ingredients, packaging, costs) }));
  const unitCosts = computed.map(x => x.c.unitCost).filter(x => x > 0);
  const marginsPct = computed.map(x => x.c.marginPct);
  const unitCostAvg = unitCosts.length ? unitCosts.reduce((a, b) => a + b, 0) / unitCosts.length : 0;
  const marginAvg = marginsPct.length ? marginsPct.reduce((a, b) => a + b, 0) / marginsPct.length : 0;
  const topProfitable = computed
    .sort((a, b) => b.c.marginPct - a.c.marginPct)
    .slice(0, 5)
    .map(x => ({ id: x.p.id, name: x.p.name, marginPct: x.c.marginPct }));
  return { unitCostAvg, marginAvg, topProfitable };
}

