import { Link } from 'react-router-dom';
import EstadoBadge from './EstadoBadge';

function tiempoRelativo(fecha) {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

export default function PersonaCard({ persona }) {
  return (
    <Link to={`/persona/${persona.id}`}>
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#1A4A7A'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
      >
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: '#EBF2FA', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
        }}>
          {persona.foto_url
            ? <img src={persona.foto_url} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
            : '👤'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              {persona.nombre} {persona.apellido}
            </span>
            <EstadoBadge estado={persona.estado} />
          </div>
          {persona.ultima_ubicacion && (
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.2rem' }}>
              📍 {persona.ultima_ubicacion}
            </p>
          )}
          <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
            {tiempoRelativo(persona.created_at)}
            {persona.tipo_registro === 'yo_mismo' && ' · Registrado por sí mismo/a'}
            {persona.tipo_registro === 'familiar' && ` · Reportado por ${persona.registrado_por}`}
            {persona.tipo_registro === 'testigo' && ` · Avistado por ${persona.registrado_por}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
