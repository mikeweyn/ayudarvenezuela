import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  return (
    <div style={{
      background: '#CC1B1B', color: '#fff',
      textAlign: 'center', padding: '0.55rem 1rem',
      fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4,
    }}>
      🚨 EMERGENCIA · Terremoto Venezuela 24/06/2026 · Sistema de búsqueda de personas
    </div>
  );
}

export function BottomNav() {
  const { pathname, search } = useLocation();

  function activo(path, extra) {
    if (extra) return pathname === path && search.includes(extra);
    return pathname === path && !search.includes('estado=');
  }

  const items = [
    { to: '/',            icon: '🏠', label: 'Inicio'       },
    { to: '/buscar',      icon: '🔍', label: 'Buscar'       },
    { to: '/reportar',    icon: '➕', label: 'Reportar', highlight: true },
    { to: '/emergencias', icon: '🆘', label: 'Emergencias'  },
    { to: '/hospital',    icon: '🏥', label: 'Hospital'     },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#1A4A7A', borderTop: '2px solid #CC1B1B',
      display: 'flex', alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {items.map(item => {
        const isActive = activo(item.to);
        return (
          <Link key={item.to} to={item.to} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '0.5rem 0.25rem',
            background: item.highlight
              ? '#CC1B1B'
              : isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{item.icon}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, marginTop: '0.15rem',
              color: isActive ? '#FFD700' : item.highlight ? '#fff' : 'rgba(255,255,255,0.8)',
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
