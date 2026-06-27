import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarRecientes } from '../api';
import PersonaCard from '../components/PersonaCard';

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const [recientes, setRecientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarRecientes().then(r => setRecientes(r.data)).catch(() => {});
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    if (busqueda.trim().length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`);
    }
  }

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Hero */}
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '2rem 1rem 2.5rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.5rem' }}>
            Busca o reporta personas<br />afectadas por el terremoto
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Venezuela, 24 de junio de 2026
          </p>

          <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Nombre y apellido de quien buscas..."
              style={{ flex: 1, borderColor: 'transparent', fontSize: '1rem' }}
              autoFocus
            />
            <button type="submit" style={{ background: '#CC1B1B', color: '#fff', whiteSpace: 'nowrap' }}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="container" style={{ marginTop: '-1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link to="/reportar?tipo=yo_mismo">
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem', borderLeft: '4px solid #1A7A3A' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Estoy bien</div>
              <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Avisa que estás a salvo</div>
            </div>
          </Link>
          <Link to="/reportar?tipo=familiar">
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem 1rem', borderLeft: '4px solid #CC1B1B' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Busco a alguien</div>
              <div style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Reporta a un familiar</div>
            </div>
          </Link>
        </div>

        {/* Registros recientes */}
        {recientes.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>
              Registros recientes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recientes.slice(0, 10).map(p => (
                <PersonaCard key={p.id} persona={p} />
              ))}
            </div>
            {recientes.length > 10 && (
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
                Usa el buscador para ver todos los registros
              </p>
            )}
          </div>
        )}

        {recientes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
            <p>Aún no hay registros. Sé el primero en reportar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
