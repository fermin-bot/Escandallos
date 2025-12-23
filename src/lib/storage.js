const DATA_KEY = 'escandallos:data';
const ROLE_KEY = 'escandallos:role';
const THEME_KEY = 'escandallos:theme';

export function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function exportData() {
  const raw = localStorage.getItem(DATA_KEY) || '{}';
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'escandallos-demo.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        saveData(obj);
        resolve(obj);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function loadRole() {
  return localStorage.getItem(ROLE_KEY) || 'admin';
}

export function saveRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

