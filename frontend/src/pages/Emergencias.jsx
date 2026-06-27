export default function Emergencias() {
  const principales = [
    { num: '911', label: 'Emergencia Nacional', desc: 'Movistar · VEN 9-1-1', color: '#CC1B1B' },
    { num: '0800-RESCATE', label: 'Línea de Rescate', desc: '0800-7372283 · gratuita', color: '#CC1B1B' },
    { num: '166', label: 'Protección Civil', desc: 'Nacional', color: '#1A4A7A' },
    { num: '167', label: 'Bomberos', desc: 'Nacional', color: '#E65100' },
  ];

  const operadoras = [
    { op: 'CANTV (fija)', num: '171', tel: '171' },
    { op: 'Movilnet', num: '*1', tel: '*1' },
    { op: 'Digitel', num: '112', tel: '112' },
    { op: 'Movistar', num: '911', tel: '911' },
  ];

  const proteccionCivil = [
    { num: '0800-2668446', tel: '08002668446' },
    { num: '0800-2624368', tel: '08002624368' },
  ];

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ background: '#CC1B1B', color: '#fff', padding: '1.5rem 1rem 2rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            🚨 Números de Emergencia
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem' }}>
            Terremoto Venezuela · 24 de junio 2026 · Toca el número para llamar
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '1.5rem' }}>

        {/* Números principales */}
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Líneas principales
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {principales.map(e => (
            <a key={e.num} href={`tel:${e.num.replace(/-/g,'')}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: `2px solid ${e.color}`, borderRadius: 14,
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{
                  background: e.color, color: '#fff', borderRadius: 10,
                  padding: '0.5rem 0.75rem', fontWeight: 900, fontSize: '1.3rem',
                  minWidth: 80, textAlign: 'center', flexShrink: 0,
                }}>
                  {e.num}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>{e.label}</div>
                  <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{e.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '1.5rem' }}>📞</div>
              </div>
            </a>
          ))}
        </div>

        {/* Protección Civil adicional */}
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Protección Civil — líneas gratuitas adicionales
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
          {proteccionCivil.map(e => (
            <a key={e.num} href={`tel:${e.tel}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#EBF2FA', border: '2px solid #1A4A7A', borderRadius: 12,
                padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A4A7A' }}>{e.num}</div>
                  <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>Protección Civil · gratuita</div>
                </div>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
              </div>
            </a>
          ))}
        </div>

        {/* Por operadora */}
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Por operadora de telefonía
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '2rem' }}>
          {operadoras.map(e => (
            <a key={e.op} href={`tel:${e.tel}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', border: '2px solid #D1D5DB', borderRadius: 12,
                padding: '0.9rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#CC1B1B', marginBottom: '0.2rem' }}>
                  {e.num}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>{e.op}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Nota informativa */}
        <div style={{
          background: '#FFF3CD', border: '2px solid #856404', borderRadius: 12,
          padding: '1rem 1.25rem',
        }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#856404', marginBottom: '0.4rem' }}>
            ℹ️ Información importante
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#6c5700', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <li>Todas las líneas 0800 son <strong>gratuitas</strong> desde teléfono fijo</li>
            <li>El <strong>911</strong> es el número unificado de emergencias VEN</li>
            <li>Si no tienes señal, prueba con la línea de tu operadora</li>
            <li>Para reportar personas desaparecidas también puedes usar esta plataforma</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
