import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { registrarPersona } from '../api';

const ESTADOS = [
  { value: 'bien', label: '✅ Está bien' },
  { value: 'herido', label: '🏥 Herido/a' },
  { value: 'desaparecido', label: '🔍 Desaparecido/a' },
  { value: 'fallecido', label: '🕊️ Fallecido/a' },
  { value: 'desconocido', label: '❓ Sin información' },
];

export default function Reportar() {
  const [params] = useSearchParams();
  const tipoInicial = params.get('tipo') || 'familiar';
  const nombreInicial = params.get('nombre') || '';

  const [form, setForm] = useState({
    nombre: nombreInicial.split(' ')[0] || '',
    apellido: nombreInicial.split(' ').slice(1).join(' ') || '',
    estado: tipoInicial === 'yo_mismo' ? 'bien' : 'desconocido',
    ultima_ubicacion: '',
    mensaje: '',
    contacto: '',
    registrado_por: '',
    tipo_registro: tipoInicial,
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(null);

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.apellido.trim() || !form.registrado_por.trim()) {
      setError('Nombre, apellido y tu nombre son obligatorios.');
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
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Registro guardado
          </h2>
          <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
            <strong>{exito.nombre} {exito.apellido}</strong> fue registrado/a correctamente.
            Otros podrán encontrar este registro y dejar información.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to={`/persona/${exito.id}`}>
              <button style={{ background: '#1A4A7A', color: '#fff', width: '100%' }}>
                Ver perfil y compartir enlace
              </button>
            </Link>
            <Link to="/">
              <button style={{ background: '#F3F4F6', color: '#374151', width: '100%' }}>
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
      {/* Selector de tipo */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { value: 'yo_mismo', label: '✅ Soy yo' },
          { value: 'familiar', label: '👨‍👩‍👧 Familiar' },
          { value: 'testigo', label: '👁️ Lo/la vi' },
        ].map(op => (
          <button key={op.value}
            onClick={() => {
              set('tipo_registro', op.value);
              if (op.value === 'yo_mismo') set('estado', 'bien');
            }}
            style={{
              flex: 1,
              background: form.tipo_registro === op.value ? '#1A4A7A' : '#F3F4F6',
              color: form.tipo_registro === op.value ? '#fff' : '#374151',
              fontSize: '0.8rem',
              padding: '0.6rem 0.25rem',
            }}>
            {op.label}
          </button>
        ))}
      </div>

      <h1 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
        {form.tipo_registro === 'yo_mismo' && 'Registrar que estoy bien'}
        {form.tipo_registro === 'familiar' && 'Reportar a un familiar'}
        {form.tipo_registro === 'testigo' && 'Informar sobre alguien que vi'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <label>Estado actual</label>
          <select value={form.estado} onChange={e => set('estado', e.target.value)}>
            {ESTADOS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </div>

        <div className="campo">
          <label>Última ubicación conocida</label>
          <input
            value={form.ultima_ubicacion}
            onChange={e => set('ultima_ubicacion', e.target.value)}
            placeholder="Ej: San Felipe, Yaracuy / Refugio Liceo Libertador"
          />
        </div>

        <div className="campo">
          <label>Mensaje adicional</label>
          <textarea
            value={form.mensaje}
            onChange={e => set('mensaje', e.target.value)}
            placeholder="Ej: Está en el refugio de la escuela, sin lesiones graves..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="campo">
          <label>Cómo contactarte</label>
          <input
            value={form.contacto}
            onChange={e => set('contacto', e.target.value)}
            placeholder="Teléfono, email, WhatsApp, Instagram..."
          />
          <small>Para que otros puedan comunicarse contigo si tienen noticias</small>
        </div>

        <div className="campo">
          <label>Tu nombre (quien registra) *</label>
          <input
            value={form.registrado_por}
            onChange={e => set('registrado_por', e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #CC1B1B', borderRadius: 8, padding: '0.75rem', color: '#CC1B1B' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={enviando}
          style={{ background: '#CC1B1B', color: '#fff', padding: '0.9rem', fontSize: '1rem' }}>
          {enviando ? 'Guardando...' : 'Guardar registro'}
        </button>
      </form>
    </div>
  );
}
