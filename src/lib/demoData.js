export const demoCosts = {
  laborHourCost: 18,
  energyHourCost: 9,
  waterPerBatchCost: 6,
  overhead: { mode: 'percent', value: 10 },
};

export const demoIngredients = [
  { id: 'ing-atun', name: 'Atún', supplier: 'Oceanic', unit: 'kg', price: 9.8, vat: 10, allergens: ['pescado'], category: 'pescado', priceHistory: [] },
  { id: 'ing-tomate', name: 'Tomate triturado', supplier: 'Huerta S.A.', unit: 'kg', price: 1.1, vat: 10, allergens: [], category: 'vegetal', priceHistory: [] },
  { id: 'ing-aceite', name: 'Aceite de oliva', supplier: 'Olivar', unit: 'l', price: 4.2, vat: 10, allergens: [], category: 'aceites', priceHistory: [] },
  { id: 'ing-sal', name: 'Sal', supplier: 'Marina', unit: 'kg', price: 0.4, vat: 10, allergens: [], category: 'condimento', priceHistory: [] },
  { id: 'ing-azucar', name: 'Azúcar', supplier: 'Azucarera', unit: 'kg', price: 0.9, vat: 10, allergens: [], category: 'endulzante', priceHistory: [] },
  { id: 'ing-vinagre', name: 'Vinagre', supplier: 'Cosecha', unit: 'l', price: 1.5, vat: 10, allergens: [], category: 'ácido', priceHistory: [] },
  { id: 'ing-mejillon', name: 'Mejillón', supplier: 'Rías', unit: 'kg', price: 6.5, vat: 10, allergens: ['moluscos'], category: 'marisco', priceHistory: [] },
  { id: 'ing-pimiento', name: 'Pimiento', supplier: 'Huerta S.A.', unit: 'kg', price: 1.7, vat: 10, allergens: [], category: 'vegetal', priceHistory: [] },
];

export const demoPackaging = [
  { id: 'env-lata120', name: 'Lata 120g', unit: 'unidad', price: 0.22, supplier: 'Latas Iberia' },
  { id: 'env-lata250', name: 'Lata 250g', unit: 'unidad', price: 0.28, supplier: 'Latas Iberia' },
  { id: 'env-tarro314', name: 'Tarro vidrio 314ml', unit: 'unidad', price: 0.32, supplier: 'Vidrios S.L.' },
  { id: 'env-tapa', name: 'Tapa', unit: 'unidad', price: 0.08, supplier: 'Tapas S.L.' },
  { id: 'env-etiqueta', name: 'Etiqueta', unit: 'unidad', price: 0.03, supplier: 'Etiquetas S.A.' },
  { id: 'env-caja24', name: 'Caja 24 uds', unit: 'unidad', price: 0.6, supplier: 'Cartones SA' },
  { id: 'env-film', name: 'Film', unit: 'm', price: 0.02, supplier: 'Plásticos' },
];

export const demoProducts = [
  {
    id: 'prod-atun-120',
    name: 'Atún en aceite 120g',
    type: 'conserva',
    status: 'aprobado',
    recipeLines: [
      { type: 'ingredient', refId: 'ing-atun', quantity: 50, unit: 'kg' },
      { type: 'ingredient', refId: 'ing-aceite', quantity: 30, unit: 'l' },
      { type: 'ingredient', refId: 'ing-sal', quantity: 1, unit: 'kg' },
      { type: 'packaging', refId: 'env-lata120', quantity: 1000, unit: 'unidad' },
      { type: 'packaging', refId: 'env-etiqueta', quantity: 1000, unit: 'unidad' },
      { type: 'packaging', refId: 'env-caja24', quantity: Math.ceil(1000 / 24), unit: 'unidad' },
    ],
    process: {
      batchSize: 1000,
      wastePct: 5,
      productionTimeMin: 120,
      workers: 6,
      machineryCostHour: 12,
      extra: { pasteurization: true, extraTimeMin: 20 },
    },
    pricing: { unitSalePrice: 2.4 },
  },
  {
    id: 'prod-mejillon-escabeche',
    name: 'Mejillones en escabeche',
    type: 'conserva',
    status: 'aprobado',
    recipeLines: [
      { type: 'ingredient', refId: 'ing-mejillon', quantity: 40, unit: 'kg' },
      { type: 'ingredient', refId: 'ing-vinagre', quantity: 12, unit: 'l' },
      { type: 'ingredient', refId: 'ing-aceite', quantity: 8, unit: 'l' },
      { type: 'ingredient', refId: 'ing-sal', quantity: 1, unit: 'kg' },
      { type: 'ingredient', refId: 'ing-pimiento', quantity: 6, unit: 'kg' },
      { type: 'packaging', refId: 'env-lata250', quantity: 800, unit: 'unidad' },
      { type: 'packaging', refId: 'env-etiqueta', quantity: 800, unit: 'unidad' },
      { type: 'packaging', refId: 'env-caja24', quantity: Math.ceil(800 / 24), unit: 'unidad' },
    ],
    process: {
      batchSize: 800,
      wastePct: 7,
      productionTimeMin: 140,
      workers: 5,
      machineryCostHour: 10,
      extra: { pasteurization: true, extraTimeMin: 15 },
    },
    pricing: { unitSalePrice: 2.9 },
  },
  {
    id: 'prod-tomate-314',
    name: 'Tomate frito tarro 314ml',
    type: 'salsa',
    status: 'borrador',
    recipeLines: [
      { type: 'ingredient', refId: 'ing-tomate', quantity: 100, unit: 'kg' },
      { type: 'ingredient', refId: 'ing-azucar', quantity: 4, unit: 'kg' },
      { type: 'ingredient', refId: 'ing-sal', quantity: 2, unit: 'kg' },
      { type: 'packaging', refId: 'env-tarro314', quantity: 900, unit: 'unidad' },
      { type: 'packaging', refId: 'env-tapa', quantity: 900, unit: 'unidad' },
      { type: 'packaging', refId: 'env-etiqueta', quantity: 900, unit: 'unidad' },
      { type: 'packaging', refId: 'env-caja24', quantity: Math.ceil(900 / 24), unit: 'unidad' },
    ],
    process: {
      batchSize: 900,
      wastePct: 10,
      productionTimeMin: 160,
      workers: 4,
      machineryCostHour: 8,
      extra: { pasteurization: true, extraTimeMin: 25 },
    },
    pricing: { unitSalePrice: 1.75 },
  },
];

