import { Link } from 'react-router-dom';

export default function Header() {
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
        EMERGENCIA — Terremoto Venezuela 24/06/2026
      </div>
      <header style={{
        background: '#1A4A7A',
        padding: '1rem',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>
            🇻🇪 AyudarVenezuela.com
          </Link>
          <Link to="/reportar" style={{
            background: '#CC1B1B',
            color: '#fff',
            padding: '0.6rem 1.1rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 700,
          }}>
            + Reportar
          </Link>
        </div>
      </header>
    </>
  );
}
