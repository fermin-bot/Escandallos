import { importDataFromFile } from '../lib/storage';
import { useData } from '../context/DataContext';

export default function Settings() {
  const { role, setRole, theme, setTheme, restoreDemo, notify } = useData();

  async function onImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importDataFromFile(file);
      notify('Datos importados');
      window.location.reload();
    } catch {
      notify('Error al importar');
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Ajustes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border space-y-2">
          <div className="font-medium">Permisos</div>
          <div className="text-sm">Rol actual: {role}</div>
          <div className="flex gap-2">
            <button className={`px-3 py-2 rounded ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`} onClick={() => setRole('admin')}>Admin (editar)</button>
            <button className={`px-3 py-2 rounded ${role === 'operario' ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`} onClick={() => setRole('operario')}>Operario (solo ver)</button>
          </div>
        </div>
        <div className="p-4 rounded border space-y-2">
          <div className="font-medium">Tema</div>
          <div className="flex gap-2">
            <button className={`px-3 py-2 rounded ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`} onClick={() => setTheme('light')}>Claro</button>
            <button className={`px-3 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700'}`} onClick={() => setTheme('dark')}>Oscuro</button>
          </div>
        </div>
        <div className="p-4 rounded border space-y-2">
          <div className="font-medium">Datos</div>
          <button className="px-3 py-2 rounded bg-emerald-600 text-white" onClick={restoreDemo}>Restaurar demo</button>
          <label className="block text-sm mt-2">Importar JSON</label>
          <input type="file" accept="application/json" onChange={onImport} />
        </div>
      </div>
    </div>
  );
}

