import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_HXH_API_URL || 'http://localhost:8000/api-hxh';

// Log para debugging - mostrar qué URL está usando
console.log('🔧 API_BASE configurada:', API_BASE);
console.log('🔧 VITE_HXH_API_URL:', import.meta.env.VITE_HXH_API_URL);

// Helper para asegurar que siempre sea un array
const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  if (value && Array.isArray(value.hunters)) return value.hunters;
  return [];
};

export default function App() {
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener hunters como array seguro
  const safeHunters = ensureArray(hunters);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    nen_tipo: '',
    afiliacion: '',
    imagen_url: '',
  });

  useEffect(() => {
    fetchHunters();
  }, []);

  const fetchHunters = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE}/hunters`;
      console.log('🌐 Fetching hunters from:', url);
      const response = await axios.get(url);
      console.log('✅ Response from backend:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      // Asegurar que data sea siempre un array
      let huntersList = [];
      if (Array.isArray(response.data)) {
        huntersList = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Si viene envuelto en un objeto { data: [...] }
        huntersList = response.data.data;
      } else if (response.data && Array.isArray(response.data.hunters)) {
        // Si viene envuelto en un objeto { hunters: [...] }
        huntersList = response.data.hunters;
      }
      
      console.log('Final hunters list:', huntersList);
      // Asegurar que siempre sea un array antes de establecerlo
      setHunters(ensureArray(huntersList));
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching hunters:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      console.error('Request URL:', err.config?.url);
      
      // Detectar si recibimos HTML en lugar de JSON
      if (err.response?.data && typeof err.response.data === 'string' && err.response.data.includes('<!doctype html>')) {
        setError(`Error: El frontend está recibiendo HTML en lugar de JSON. Verifica que VITE_HXH_API_URL esté configurada correctamente en Railway. URL actual: ${API_BASE}`);
      } else {
        setError(`No se pudieron cargar los cazadores. Verifica el backend. URL: ${API_BASE}/hunters`);
      }
      setHunters([]); // Asegurar que hunters sea siempre un array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE}/hunters`;
      console.log('🌐 Creating hunter at:', url);
      await axios.post(url, {
        ...form,
        edad: form.edad ? Number(form.edad) : undefined,
      });
      setForm({
        nombre: '',
        edad: '',
        nen_tipo: '',
        afiliacion: '',
        imagen_url: '',
      });
      setShowForm(false);
      fetchHunters();
    } catch (err) {
      console.error('❌ Error creating hunter:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      
      // Detectar si recibimos HTML en lugar de JSON
      if (err.response?.data && typeof err.response.data === 'string' && err.response.data.includes('<!doctype html>')) {
        alert(`Error: El frontend está recibiendo HTML en lugar de JSON. Verifica que VITE_HXH_API_URL esté configurada correctamente en Railway. URL actual: ${API_BASE}`);
      } else {
        alert(err.response?.data?.detail || 'Error al crear cazador');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cazador?')) return;
    try {
      await axios.delete(`${API_BASE}/hunters/${id}`);
      fetchHunters();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar');
    }
  };

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de resetear todos los cazadores? Esto eliminará todos los cazadores actuales y restaurará los iniciales.')) return;
    try {
      await axios.post(`${API_BASE}/hunters/reset`);
      alert('Cazadores reseteados correctamente');
      fetchHunters();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al resetear cazadores');
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <div className="loading">Cargando cazadores... 🪙</div>
      </div>
    );
  }

  return (
    <div className="layout">
      {/* Partículas flotantes tipo Nen */}
      <div className="nen-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="nen-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* Navegación de otros proyectos */}
      <nav className="nav-projects">
        <span className="nav-projects-label">Otros proyectos:</span>
        <a
          href="https://caballeros-production-3b98.up.railway.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-projects-link"
        >
          ⚔️ Caballeros Del Zodiaco
        </a>
      </nav>

      <header className="header">
        <div>
          <p className="eyebrow">Microservicio independiente</p>
          <h1>Hunter x Hunter Dashboard</h1>
          <p className="subtitle">Administración de cazadores con FastAPI + MongoDB</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Nuevo cazador'}
          </button>
          <button className="btn btn-secondary" onClick={fetchHunters}>
            Actualizar
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleReset}
            title="Restaurar cazadores iniciales"
          >
            🔄 Resetear
          </button>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {showForm && (
        <section className="card form-card">
          <h2>Registrar cazador</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Edad"
              value={form.edad}
              onChange={(e) => setForm({ ...form, edad: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tipo de Nen"
              value={form.nen_tipo}
              onChange={(e) => setForm({ ...form, nen_tipo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Afiliación"
              value={form.afiliacion}
              onChange={(e) => setForm({ ...form, afiliacion: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL de imagen *"
              value={form.imagen_url}
              onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
              required
            />
            <button className="btn btn-primary full" type="submit">
              Guardar cazador
            </button>
          </form>
        </section>
      )}

      <section className="stats">
        <div className="stat-card">
          <span className="stat-number">{safeHunters.length}</span>
          <span className="stat-label">Cazadores activos</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {[...new Set(safeHunters.map((h) => h.nen_tipo).filter(Boolean))].length}
          </span>
          <span className="stat-label">Tipos de Nen</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {[...new Set(safeHunters.map((h) => h.afiliacion).filter(Boolean))].length}
          </span>
          <span className="stat-label">Afiliaciones</span>
        </div>
      </section>

      <section className="grid">
        {safeHunters.length > 0 ? (
          safeHunters.map((hunter) => (
          <article key={hunter._id} className="card hunter-card">
            <div className="avatar">
              <img
                src={hunter.imagen_url}
                alt={hunter.nombre}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=' + hunter.nombre;
                }}
              />
            </div>
            <div className="hunter-info">
              <h3>{hunter.nombre}</h3>
              <p className="meta">{hunter.afiliacion || 'Independiente'}</p>
              <div className="chips">
                {hunter.nen_tipo && <span>✨ {hunter.nen_tipo}</span>}
                {hunter.edad && <span>🎂 {hunter.edad} años</span>}
              </div>
              <button className="btn btn-danger full" onClick={() => handleDelete(hunter._id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))
        ) : (
          <div className="card">
            <p>No hay cazadores registrados aún.</p>
          </div>
        )}
      </section>
    </div>
  );
}

