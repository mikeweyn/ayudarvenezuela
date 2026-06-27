import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  function navStyle(path) {
    const active = pathname === path || (path === '/buscar' && pathname.startsWith('/buscar'));
    return {
      color: active ? '#FFD700' : 'rgba(255,255,255,0.85)',
      fontWeight: 700,
      fontSize: '0.9rem',
      padding: '0.4rem 0.6rem',
      borderRadius: 8,
      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
      whiteSpace: 'nowrap',
    };
  }

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
        padding: '0.75rem 1rem',
        borderBottom: '3px solid #CC1B1B',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
            🇻🇪 AyudarVE
          </Link>

          <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={navStyle('/')}>🏠</Link>
            <Link to="/buscar" style={navStyle('/buscar')}>🔍 Buscar</Link>
            <Link to="/buscar?estado=desaparecido" style={{
              ...navStyle('/desaparecidos'),
              color: pathname === '/desaparecidos' ? '#FFD700' : '#FFD700',
              background: 'rgba(255,215,0,0.12)',
            }}>
              🔎 Desaparecidos
            </Link>
            <Link to="/emergencias" style={{
              background: '#CC1B1B', color: '#fff',
              padding: '0.4rem 0.7rem', borderRadius: 8,
              fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap',
            }}>
              🆘 Emergencias
            </Link>
            <Link to="/reportar" style={{
              background: '#1A7A3A', color: '#fff',
              padding: '0.4rem 0.7rem', borderRadius: 8,
              fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap',
            }}>
              + Reportar
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
