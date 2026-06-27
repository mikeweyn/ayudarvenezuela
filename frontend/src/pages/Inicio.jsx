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
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.4rem' }}>
            Busca o reporta personas<br />afectadas por el terremoto
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '1.5rem' }}>
            Venezuela · 24 de junio de 2026
          </p>

          <form onSubmit={handleBuscar}>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Escribe el nombre de quien buscas..."
              style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}
              autoFocus
            />
            <button type="submit"
              style={{ background: '#CC1B1B', color: '#fff', width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
              🔍 Buscar persona
            </button>
          </form>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="container" style={{ marginTop: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#4B5563', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          ¿Qué necesitas hacer?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>

          <Link to="/reportar?tipo=yo_mismo">
            <div style={{
              background: '#fff', border: '2px solid #1A7A3A', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A7A3A' }}>Estoy vivo/a y estoy bien</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Avisa a tu familia que estás a salvo
                </div>
              </div>
            </div>
          </Link>

          <Link to="/reportar?tipo=familiar">
            <div style={{
              background: '#fff', border: '2px solid #CC1B1B', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>🔍</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#CC1B1B' }}>Busco a un familiar</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Reporta a alguien que no has podido contactar
                </div>
              </div>
            </div>
          </Link>

          <Link to="/reportar?tipo=testigo">
            <div style={{
              background: '#fff', border: '2px solid #1A4A7A', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>👁️</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A4A7A' }}>Vi a alguien y tengo información</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Informa sobre alguien que viste o encontraste
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Registros recientes */}
        {recientes.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#374151' }}>
              Registros recientes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recientes.slice(0, 10).map(p => (
                <PersonaCard key={p.id} persona={p} />
              ))}
            </div>
          </div>
        )}

        {recientes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋</div>
            <p style={{ fontSize: '1rem' }}>Aún no hay registros. Sé el primero en reportar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
