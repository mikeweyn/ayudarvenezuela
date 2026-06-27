import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <>
      <div style={{
        background: '#CC1B1B',
        color: '#fff',
        textAlign: 'center',
        padding: '0.6rem 1rem',
        fontSize: '1rem',
        fontWeight: 700,
        lineHeight: 1.4,
      }}>
        🚨 EMERGENCIA — Terremoto Venezuela 24/06/2026 — Sistema de búsqueda de personas
      </div>
      <header style={{
        background: '#1A4A7A',
        padding: '0.9rem 1rem',
        borderBottom: '3px solid #CC1B1B',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>
            🇻🇪 AyudarVenezuela
          </Link>

          <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to="/" style={{
              color: pathname === '/' ? '#FFD700' : 'rgba(255,255,255,0.85)',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              background: pathname === '/' ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}>
              🏠 Inicio
            </Link>
            <Link to="/buscar" style={{
              color: pathname === '/buscar' ? '#FFD700' : 'rgba(255,255,255,0.85)',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              background: pathname === '/buscar' ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}>
              🔍 Buscar
            </Link>
            <Link to="/reportar" style={{
              background: '#CC1B1B',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              fontSize: '0.95rem',
              fontWeight: 700,
            }}>
              + Reportar
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
