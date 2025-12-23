import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Masters from './pages/Masters';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Comparator from './pages/Comparator';
import Simulator from './pages/Simulator';
import ExportPage from './pages/Export';
import Settings from './pages/Settings';
import { DataProvider, useData } from './context/DataContext';
import Toast from './components/Toast';
import './index.css';

function Layout({ children }) {
  const { theme, toast } = useData();
  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
      <header className="border-b bg-white/70 dark:bg-zinc-800/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Escandallos Demo</Link>
          <nav className="flex gap-3 text-sm">
            <Link to="/products" className="hover:underline">Escandallos</Link>
            <Link to="/masters" className="hover:underline">Maestros</Link>
            <Link to="/comparator" className="hover:underline">Comparador</Link>
            <Link to="/simulator" className="hover:underline">Simulador</Link>
            <Link to="/export" className="hover:underline">Exportación</Link>
            <Link to="/settings" className="hover:underline">Ajustes</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <Toast text={toast} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/comparator" element={<Comparator />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}
