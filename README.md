- La aplicación web está creada y funcionando con React + Vite + Tailwind v4 y react-router-dom .
- Servidor de desarrollo activo en http://localhost:5173/ .
- Build de producción verificada con npm run build .
- Persistencia local con localStorage , datos de demo precargados y botón “Restaurar demo”.
- UI responsive con modo claro/oscuro, roles “admin” (editar) y “operario” (solo ver), notificaciones y confirmaciones.
Cómo arrancar

- Ejecuta npm i si hiciera falta (ya instalado).
- Ejecuta npm run dev y abre http://localhost:5173/ .
- Build de producción: npm run build .
Módulos

- Dashboard
  - KPIs: coste unitario medio y margen medio.
  - Top 5 productos más rentables con mini-barras.
  - Alertas:
    - Margen bajo 15% por producto.
    - Ingredientes que subieron de precio según historial.
- Maestros
  - Ingredientes: nombre, proveedor, unidad, precio, IVA, alérgenos, categoría.
  - Historial de precio: guarda hasta las últimas 5 modificaciones con fecha.
  - Materiales de envase: nombre, unidad, precio, proveedor.
  - Costes indirectos: coste hora operario, energía/hora, agua/lote, gastos generales (% o fijo).
  - Edición deshabilitada si rol es operario .
- Escandallos
  - Listado con búsqueda y filtros por tipo, margen < X, coste > X, estado.
  - Ficha de producto con pestañas:
    - Receta/BOM: líneas de ingredientes y envases, selector desde maestros, cantidad, unidad, coste línea; añadir/eliminar línea.
    - Proceso: tamaño de lote, merma (% limitado 0–50), tiempo, operarios, maquinaria, pasteurización/esterilización y tiempo extra.
    - Costes y precios: desglose de categorías, coste total de lote, coste unitario, precio venta unitario, margen € y %; semáforo por margen.
  - Alérgenos heredados de ingredientes visibles en la ficha.
- Comparador
  - Comparación de 2 productos con tabla y mini-barras por categoría de coste y margen.
- Simulador
  - “¿Y si…?”: subir/bajar % precio de un ingrediente, cambiar merma, cambiar precio de venta, con impacto directo en coste unitario y margen.
- Exportación
  - Exportar datos completos a JSON.
  - Exportar listado de escandallos a CSV.
  - Vista imprimible de un escandallo con botón “Imprimir”.
Reglas de cálculo

- Coste línea = cantidad * precio unidad (asumiendo unidades correctas; conversión fuera de alcance de demo).
- Merma: consumo_real = consumo_teórico / (1 - merma%) .
- Mano de obra: (tiempo_min/60) * operarios * coste_hora .
- Energía: (tiempo_min/60) * coste_energía_hora .
- Maquinaria: (tiempo_min/60) * coste_maquinaria_hora .
- Gastos generales:
  - % sobre suma de materia prima + envase + mano de obra + energía + agua + maquinaria.
  - O fijo por lote (configurable).
- Coste unitario = coste_lote / unidades_lote .
- Margen: € = precio_unitario - coste_unitario ; % = margen€/precio_unitario * 100 .
Datos precargados

- Ingredientes: Atún, Tomate triturado, Aceite de oliva, Sal, Azúcar, Vinagre, Mejillón, Pimiento con precios realistas inventados.
- Envases: Lata 120g, Lata 250g, Tarro vidrio 314ml, Tapa, Etiqueta, Caja 24 uds, Film.
- Productos:
  - “Atún en aceite 120g”
  - “Mejillones en escabeche”
  - “Tomate frito tarro 314ml”
- Cada uno con receta, lote, merma, tiempos, precio de venta y márgenes distintos.
Persistencia y calidad

- Persistencia en localStorage de maestros, escandallos y historial de precios.
- Botones: “Exportar datos JSON” y “Importar datos JSON” (en Ajustes).
- Validaciones:
  - No negativos en cantidades y precios.
  - Merma limitada 0–50%.
- Confirmaciones al borrar.
- Notificaciones “Guardado”, “Eliminado”, “Demo restaurada” e “Importación” con toast.
- Diseño “panel industrial” con Tailwind; responsive.
Dónde está todo

- Vite config con Tailwind v4 plugin en vite.config.js:1 .
- Estilos base y Tailwind import en src/index.css:1 .
- Router y layout principal en src/App.jsx:1 .
- Contexto de datos y persistencia en src/context/DataContext.jsx:1 .
- Datos demo en src/lib/demoData.js:1 .
- Cálculos en src/lib/calculations.js:1 .
- Utilidades de localStorage y exportación en src/lib/storage.js:1 .
- Páginas:
  - Dashboard en src/pages/Dashboard.jsx:1 .
  - Maestros en src/pages/Masters.jsx:1 .
  - Listado de productos en src/pages/Products.jsx:1 .
  - Ficha de producto en src/pages/ProductDetail.jsx:1 .
  - Comparador en src/pages/Comparator.jsx:1 .
  - Simulador en src/pages/Simulator.jsx:1 .
  - Exportación en src/pages/Export.jsx:1 .
  - Ajustes en src/pages/Settings.jsx:1 .
- Componentes:
  - Semáforo en src/components/Semaforo.jsx:1 .
  - KPIs y mini-barras en src/components/KPI.jsx:1 .
  - Toast en src/components/Toast.jsx:1 .
Uso rápido de la demo

- Dashboard: revisa KPIs, alertas y acceso rápido a módulos.
- Maestros: edita ingredientes, envases y costes. Cambios de precio guardan historial (últimas 5).
- Escandallos: abre un producto, ajusta receta y proceso, y observa coste y margen en tiempo real. Añade líneas desde maestros.
- Comparador: selecciona dos productos y compara costes y márgenes.
- Simulador: prueba cambios de precio de un ingrediente, merma y precio de venta.
- Exportación: imprime una ficha, exporta CSV del listado y exporta/importa JSON.
- Ajustes: cambia tema y rol, y restaura la demo.
Comandos

- npm run dev abre la app en http://localhost:5173/ .
- npm run build genera producción en dist/ .
- npm run lint pasa el lint.
