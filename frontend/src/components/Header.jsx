import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <div style={{
        background: '#CC1B1B',
        color: '#fff',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}>
        EMERGENCIA — Terremoto Venezuela 24/06/2026 — Sistema de búsqueda de personas
      </div>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '0.9rem 1rem',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1A4A7A' }}>
            🇻🇪 AyudarVenezuela
          </Link>
          <Link to="/reportar" style={{
            background: '#CC1B1B',
            color: '#fff',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}>
            Reportar
          </Link>
        </div>
      </header>
    </>
  );
}
