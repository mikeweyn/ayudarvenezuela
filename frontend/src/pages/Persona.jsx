import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerPersona, agregarAviso } from '../api';
import EstadoBadge from '../components/EstadoBadge';

function formatFecha(iso) {
  return new Date(iso).toLocaleString('es-VE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ContactoLink({ contacto }) {
  if (!contacto) return null;
  const c = contacto.trim();
  let href, icon, label;
  if (c.startsWith('@')) {
    href = `https://t.me/${c.slice(1)}`;
    icon = '✈️'; label = `Telegram: ${c}`;
  } else if (/^[\d\s\-+()]{7,}$/.test(c)) {
    href = `https://wa.me/${c.replace(/\D/g,'')}`;
    icon = '💬'; label = `WhatsApp: ${c}`;
  } else if (c.includes('@')) {
    href = `mailto:${c}`;
    icon = '✉️'; label = c;
  } else {
    return <span style={{ fontSize: '0.85rem', color: '#374151' }}>📞 {c}</span>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: '#1A4A7A', color: '#fff', borderRadius: 8,
      padding: '0.4rem 0.75rem', fontSize: '0.85rem', fontWeight: 700,
      textDecoration: 'none', marginTop: '0.4rem',
    }}>
      {icon} Contactar: {label}
    </a>
  );
}

export default function Persona() {
  const { id } = useParams();
  const [persona, setPersona] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [aviso, setAviso] = useState({ autor: '', texto: '', ubicacion: '', contacto: '' });
  const [enviandoAviso, setEnviandoAviso] = useState(false);
  const [avisoOk, setAvisoOk] = useState(false);

  async function cargar() {
    try {
      const { data } = await obtenerPersona(id);
      setPersona(data);
    } catch {
      setError('No se encontró esta persona.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, [id]);

  async function handleAviso(e) {
    e.preventDefault();
    if (!aviso.autor.trim() || !aviso.texto.trim()) return;
    setEnviandoAviso(true);
    try {
      await agregarAviso({ persona_id: id, ...aviso });
      setAvisoOk(true);
      setAviso({ autor: '', texto: '', ubicacion: '', contacto: '' });
      await cargar();
    } catch {
      alert('Error al enviar aviso.');
    } finally {
      setEnviandoAviso(false);
    }
  }

  function compartir() {
    if (navigator.share) {
      navigator.share({ title: `${persona.nombre} ${persona.apellido} | AyudaVenezuela`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  }

  if (cargando) return <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>Cargando...</div>;
  if (error) return (
    <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
      <p style={{ color: '#CC1B1B', marginBottom: '1rem' }}>{error}</p>
      <Link to="/" style={{ color: '#1A4A7A', fontWeight: 600 }}>← Volver al inicio</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <Link to="/" style={{ color: '#6B7280', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Volver
      </Link>

      {/* Perfil */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#EBF2FA',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0,
          }}>
            {persona.foto_url
              ? <img src={persona.foto_url} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
              : '👤'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              {persona.nombre} {persona.apellido}
            </h1>
            <EstadoBadge estado={persona.estado} />
          </div>
        </div>

        {persona.cedula && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span>🪪</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{persona.cedula}</span>
          </div>
        )}
        {persona.ultima_ubicacion && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
            <span>📍</span>
            <span style={{ fontSize: '0.95rem' }}>{persona.ultima_ubicacion}</span>
          </div>
        )}
        {persona.mensaje && (
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '0.75rem', marginBottom: '0.6rem', fontSize: '0.95rem' }}>
            "{persona.mensaje}"
          </div>
        )}
        {persona.contacto && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <span>📞</span>
            <span style={{ fontSize: '0.9rem', color: '#374151' }}>{persona.contacto}</span>
          </div>
        )}

        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginBottom: '1rem' }}>
          Registrado el {formatFecha(persona.created_at)} por {persona.registrado_por}
        </p>

        <button onClick={compartir} style={{ background: '#EBF2FA', color: '#1A4A7A', width: '100%' }}>
          📤 Compartir este perfil
        </button>
      </div>

      {/* Avisos de terceros */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Información de terceros ({persona.avisos?.length || 0})
        </h2>

        {persona.avisos?.length === 0 && (
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Nadie ha dejado información aún. Si sabes algo, completa el formulario de abajo.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {persona.avisos?.map(a => (
            <div key={a.id} className="card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.autor}</span>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{formatFecha(a.created_at)}</span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>{a.texto}</p>
              {a.ubicacion && <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.25rem' }}>📍 {a.ubicacion}</p>}
              {a.contacto && (
                <div style={{ marginTop: '0.5rem' }}>
                  <ContactoLink contacto={a.contacto} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulario aviso */}
      <div className="card" style={{ borderColor: '#1A4A7A', borderWidth: 2 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          💬 Tengo información sobre esta persona
        </h3>
        {avisoOk && (
          <div style={{ background: '#EBF7EF', borderRadius: 8, padding: '0.75rem', color: '#1A7A3A', marginBottom: '1rem', fontWeight: 600 }}>
            ✅ Gracias, tu aviso fue enviado.
          </div>
        )}
        <form onSubmit={handleAviso} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="campo">
            <label>Tu nombre *</label>
            <input value={aviso.autor} onChange={e => setAviso(a => ({ ...a, autor: e.target.value }))} placeholder="Tu nombre" />
          </div>
          <div className="campo">
            <label>¿Qué sabes? *</label>
            <textarea value={aviso.texto} onChange={e => setAviso(a => ({ ...a, texto: e.target.value }))}
              placeholder="Ej: Lo vi en el refugio de la escuela Simón Bolívar, estaba bien..."
              rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div className="campo">
            <label>¿Dónde lo/la viste?</label>
            <input value={aviso.ubicacion} onChange={e => setAviso(a => ({ ...a, ubicacion: e.target.value }))}
              placeholder="Barrio, sector, refugio..." />
          </div>
          <div className="campo">
            <label>Tu contacto (opcional) — para que la familia pueda escribirte</label>
            <input value={aviso.contacto} onChange={e => setAviso(a => ({ ...a, contacto: e.target.value }))}
              placeholder="@TelegramUser, número WhatsApp, o email" />
            <small style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
              Solo se muestra a quienes vean este aviso. Puedes dejar @usuario de Telegram si prefieres no dar tu número.
            </small>
          </div>
          <button type="submit" disabled={enviandoAviso || !aviso.autor.trim() || !aviso.texto.trim()}
            style={{ background: '#1A4A7A', color: '#fff' }}>
            {enviandoAviso ? 'Enviando...' : 'Enviar aviso'}
          </button>
        </form>
      </div>
    </div>
  );
}
