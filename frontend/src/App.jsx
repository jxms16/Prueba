import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_HXH_API_URL || 'http://localhost:8000/api-hxh';

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
      const response = await axios.get(`${API_BASE}/hunters`);
      console.log('Response from backend:', response.data);
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
      console.error('Error fetching hunters:', err);
      console.error('Response:', err.response?.data);
      setError('No se pudieron cargar los cazadores. Verifica el backend.');
      setHunters([]); // Asegurar que hunters sea siempre un array
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/hunters`, {
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
      alert(err.response?.data?.detail || 'Error al crear cazador');
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

  if (loading) {
    return (
      <div className="layout">
        <div className="loading">Cargando cazadores... 🪙</div>
      </div>
    );
  }

  return (
    <div className="layout">
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

