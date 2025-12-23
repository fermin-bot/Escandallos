import { createContext, useContext, useEffect, useState } from 'react';
import { demoCosts, demoIngredients, demoPackaging, demoProducts } from '../lib/demoData';
import { loadData, saveData, loadRole, saveRole, loadTheme, saveTheme } from '../lib/storage';
import { computeRecipeCosts } from '../lib/calculations';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    const loaded = loadData();
    return loaded || {
      ingredients: demoIngredients,
      packaging: demoPackaging,
      products: demoProducts,
      costs: demoCosts,
    };
  });
  const [role, setRole] = useState(loadRole());
  const [theme, setTheme] = useState(loadTheme());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    saveRole(role);
  }, [role]);

  useEffect(() => {
    saveTheme(theme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  function notify(text) {
    setToast(text);
    setTimeout(() => setToast(null), 2000);
  }

  function restoreDemo() {
    setData({
      ingredients: demoIngredients,
      packaging: demoPackaging,
      products: demoProducts,
      costs: demoCosts,
    });
    notify('Demo restaurada');
  }

  function upsertItem(collection, item) {
    setData(prev => {
      const arr = prev[collection] || [];
      const exists = arr.findIndex(x => x.id === item.id);
      const next = [...arr];
      if (exists >= 0) next[exists] = item;
      else next.push(item);
      return { ...prev, [collection]: next };
    });
    notify('Guardado');
  }

  function deleteItem(collection, id) {
    setData(prev => {
      const arr = prev[collection] || [];
      const next = arr.filter(x => x.id !== id);
      return { ...prev, [collection]: next };
    });
    notify('Eliminado');
  }

  function recomputeProduct(id) {
    const p = data.products.find(x => x.id === id);
    if (!p) return null;
    return computeRecipeCosts(p, data.ingredients, data.packaging, data.costs);
  }

  const value = {
    data,
    setData,
    role,
    setRole,
    theme,
    setTheme,
    toast,
    notify,
    restoreDemo,
    upsertItem,
    deleteItem,
    recomputeProduct,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}

