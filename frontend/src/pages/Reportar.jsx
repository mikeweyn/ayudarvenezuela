import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { registrarPersona } from '../api';

function BannerSubirLista() {
  return (
    <Link to="/subir-lista" style={{ display: 'block', marginBottom: '1.5rem' }}>
      <div style={{
        background: '#F5F3FF', border: '2px solid #7C3AED', borderRadius: 14,
        padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <span style={{ fontSize: '2rem' }}>📷</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, color: '#7C3AED', fontSize: '0.95rem' }}>¿Tenés una lista escrita a mano?</div>
          <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '0.1rem' }}>Subí la foto y la IA importa todos los nombres sola</div>
        </div>
        <span style={{ color: '#7C3AED', fontWeight: 800 }}>→</span>
      </div>
    </Link>
  );
}

const ESTADOS = [
  { value: 'bien',        label: '✅ Está bien' },
  { value: 'herido',      label: '🏥 Está herido/a' },
  { value: 'desaparecido',label: '🔍 Desaparecido/a' },
  { value: 'fallecido',   label: '🕊️ Fallecido/a' },
  { value: 'desconocido', label: '❓ No sé' },
];

const TIPOS = [
  { value: 'yo_mismo', emoji: '✅', label: 'Soy yo mismo/a',     desc: 'Me estoy registrando' },
  { value: 'familiar', emoji: '👨‍👩‍👧', label: 'Es mi familiar',      desc: 'Lo/la busco o reporto' },
  { value: 'testigo',  emoji: '👁️', label: 'Lo/la vi',            desc: 'Tengo información' },
];

export default function Reportar() {
  const [params] = useSearchParams();
  const tipoInicial = params.get('tipo') || 'familiar';
  const nombreInicial = params.get('nombre') || '';

  const [form, setForm] = useState({
    nombre:          nombreInicial.split(' ')[0] || '',
    apellido:        nombreInicial.split(' ').slice(1).join(' ') || '',
    estado:          tipoInicial === 'yo_mismo' ? 'bien' : 'desconocido',
    ultima_ubicacion:'',
    mensaje:         '',
    contacto:        '',
    registrado_por:  '',
    tipo_registro:   tipoInicial,
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState('');
  const [exito, setExito]       = useState(null);

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.apellido.trim() || !form.registrado_por.trim()) {
      setError('Por favor completa: nombre, apellido y tu nombre.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const { data } = await registrarPersona(form);
      setExito(data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al guardar. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            ¡Registro guardado!
          </h2>
          <p style={{ color: '#374151', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
            <strong>{exito.nombre} {exito.apellido}</strong> fue registrado/a correctamente.
            Otros podrán encontrar este registro y dejar información.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to={`/persona/${exito.id}`}>
              <button style={{ background: '#1A4A7A', color: '#fff', width: '100%', fontSize: '1.1rem' }}>
                Ver el registro y compartirlo
              </button>
            </Link>
            <Link to="/">
              <button style={{ background: '#F3F4F6', color: '#374151', width: '100%', fontSize: '1.1rem' }}>
                Volver al inicio
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>

      <BannerSubirLista />

      {/* Paso 1: tipo */}
      <div style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem', color: '#111827' }}>
          Paso 1 — ¿Qué quieres hacer?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {TIPOS.map(op => (
            <button key={op.value}
              onClick={() => {
                set('tipo_registro', op.value);
                if (op.value === 'yo_mismo') set('estado', 'bien');
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left',
                background: form.tipo_registro === op.value ? '#1A4A7A' : '#F3F4F6',
                color:      form.tipo_registro === op.value ? '#fff'    : '#374151',
                padding: '1rem 1.25rem', borderRadius: 12, fontSize: '1rem',
                border: form.tipo_registro === op.value ? '2px solid #1A4A7A' : '2px solid #E5E7EB',
              }}>
              <span style={{ fontSize: '1.75rem' }}>{op.emoji}</span>
              <div>
                <div style={{ fontWeight: 800 }}>{op.label}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{op.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2: datos */}
      <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1rem', color: '#111827' }}>
        Paso 2 — Datos de la persona
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="campo">
            <label>Nombre *</label>
            <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Juan" />
          </div>
          <div className="campo">
            <label>Apellido *</label>
            <input value={form.apellido} onChange={e => set('apellido', e.target.value)} placeholder="Pérez" />
          </div>
        </div>

        <div className="campo">
          <label>¿Cómo está?</label>
          <select value={form.estado} onChange={e => set('estado', e.target.value)}>
            {ESTADOS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </div>

        <div className="campo">
          <label>¿Dónde estaba o estuvo por última vez?</label>
          <input
            value={form.ultima_ubicacion}
            onChange={e => set('ultima_ubicacion', e.target.value)}
            placeholder="Ej: San Felipe, Yaracuy · Refugio Liceo Libertador"
          />
        </div>

        <div className="campo">
          <label>Mensaje adicional (opcional)</label>
          <textarea
            value={form.mensaje}
            onChange={e => set('mensaje', e.target.value)}
            placeholder="Ej: Está en el refugio de la escuela, sin lesiones graves..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="campo">
          <label>¿Cómo pueden contactarte? (opcional)</label>
          <input
            value={form.contacto}
            onChange={e => set('contacto', e.target.value)}
            placeholder="Teléfono, WhatsApp, correo..."
          />
          <small>Para que otros puedan comunicarse contigo si tienen noticias</small>
        </div>

        <div className="campo">
          <label>Tu nombre (quien hace el registro) *</label>
          <input
            value={form.registrado_por}
            onChange={e => set('registrado_por', e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '2px solid #CC1B1B', borderRadius: 10, padding: '1rem', color: '#CC1B1B', fontSize: '1rem', lineHeight: 1.5 }}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={enviando}
          style={{ background: '#CC1B1B', color: '#fff', padding: '1.1rem', fontSize: '1.15rem', marginTop: '0.5rem' }}>
          {enviando ? 'Guardando...' : '✅ Guardar registro'}
        </button>
      </form>
    </div>
  );
}
