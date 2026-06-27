import { useState, useRef } from 'react';
import { registrarPersona } from '../api';

const ESTADOS = [
  { val: 'herido',      label: 'Herido/a',      color: '#E65100', bg: '#FFF3E0' },
  { val: 'bien',        label: 'Bien / Estable', color: '#1A7A3A', bg: '#EBF7EF' },
  { val: 'fallecido',   label: 'Fallecido/a',    color: '#4B5563', bg: '#F3F4F6' },
  { val: 'desconocido', label: 'Sin datos',       color: '#6B7280', bg: '#F9FAFB' },
];

export default function Hospital() {
  const [hospital, setHospital] = useState(() => localStorage.getItem('hospital_nombre') || '');
  const [hospitalConfirmado, setHospitalConfirmado] = useState(() => !!localStorage.getItem('hospital_nombre'));

  const vacio = { nombre: '', apellido: '', cedula: '', estado: 'herido', nota: '' };
  const [form, setForm] = useState(vacio);
  const [enviando, setEnviando] = useState(false);
  const [registrados, setRegistrados] = useState([]);
  const [error, setError] = useState('');
  const nombreRef = useRef();

  function confirmarHospital(e) {
    e.preventDefault();
    if (!hospital.trim()) return;
    localStorage.setItem('hospital_nombre', hospital.trim());
    setHospitalConfirmado(true);
    setTimeout(() => nombreRef.current?.focus(), 100);
  }

  function cambiarHospital() {
    localStorage.removeItem('hospital_nombre');
    setHospitalConfirmado(false);
    setRegistrados([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.apellido.trim()) return;
    setEnviando(true);
    setError('');
    try {
      await registrarPersona({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        estado: form.estado,
        ultima_ubicacion: hospital.trim(),
        mensaje: [form.cedula ? `Cédula: ${form.cedula.trim()}` : '', form.nota.trim()].filter(Boolean).join(' · ') || null,
        registrado_por: `Hospital: ${hospital.trim()}`,
        tipo_registro: 'testigo',
      });
      setRegistrados(prev => [
        { nombre: form.nombre, apellido: form.apellido, estado: form.estado, cedula: form.cedula },
        ...prev,
      ]);
      setForm(vacio);
      nombreRef.current?.focus();
    } catch {
      setError('Error al registrar. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (!hospitalConfirmado) {
    return (
      <div style={{ paddingBottom: '5rem' }}>
        <div style={{ background: '#1A4A7A', color: '#fff', padding: '1.5rem 1rem 2rem' }}>
          <div className="container">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>🏥 Registro de Hospital</h1>
            <p style={{ opacity: 0.85, fontSize: '1rem' }}>Registra rápidamente a los pacientes que ingresan</p>
          </div>
        </div>
        <div className="container" style={{ marginTop: '2rem' }}>
          <form onSubmit={confirmarHospital}>
            <div className="campo">
              <label style={{ fontSize: '1.1rem' }}>Nombre completo del hospital o centro de salud</label>
              <input
                value={hospital}
                onChange={e => setHospital(e.target.value)}
                placeholder="Ej: Hospital General de San Felipe, Yaracuy"
                style={{ fontSize: '1.1rem' }}
                autoFocus
              />
            </div>
            <button type="submit" disabled={!hospital.trim()}
              style={{ background: '#1A4A7A', color: '#fff', width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>
              Comenzar registro →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header hospital */}
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '1rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: '0.15rem' }}>🏥 Modo hospital</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{hospital}</div>
            <div style={{ fontSize: '0.8rem', color: '#FFD700', marginTop: '0.15rem' }}>
              {registrados.length} registrado{registrados.length !== 1 ? 's' : ''} esta sesión
            </div>
          </div>
          <button onClick={cambiarHospital}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem', padding: '0.35rem 0.75rem', minHeight: 'unset' }}>
            Cambiar
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '1.25rem' }}>
        {/* Formulario rápido */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

          {/* Estado — selección visual rápida */}
          <div>
            <label style={{ fontWeight: 700, fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>Estado del paciente</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {ESTADOS.map(e => (
                <button key={e.val} type="button" onClick={() => setForm(f => ({ ...f, estado: e.val }))}
                  style={{
                    background: form.estado === e.val ? e.color : e.bg,
                    color: form.estado === e.val ? '#fff' : e.color,
                    border: `2px solid ${e.color}`,
                    borderRadius: 10, padding: '0.6rem', fontWeight: 700,
                    fontSize: '0.95rem', cursor: 'pointer', minHeight: 48,
                  }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="campo">
              <label>Nombre *</label>
              <input ref={nombreRef} value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre" style={{ fontSize: '1.05rem' }} />
            </div>
            <div className="campo">
              <label>Apellido *</label>
              <input value={form.apellido}
                onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
                placeholder="Apellido" style={{ fontSize: '1.05rem' }} />
            </div>
          </div>

          <div className="campo">
            <label>Cédula (opcional)</label>
            <input value={form.cedula}
              onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
              placeholder="V-12.345.678" inputMode="numeric" />
          </div>

          <div className="campo">
            <label>Nota adicional (opcional)</label>
            <input value={form.nota}
              onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
              placeholder="Ej: sin documentos, trauma craneal, menor de edad..." />
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '2px solid #CC1B1B', borderRadius: 8, padding: '0.75rem', color: '#CC1B1B', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          <button type="submit"
            disabled={enviando || !form.nombre.trim() || !form.apellido.trim()}
            style={{
              background: enviando ? '#6B7280' : '#1A7A3A', color: '#fff',
              fontSize: '1.15rem', padding: '1rem', fontWeight: 800,
            }}>
            {enviando ? 'Guardando...' : '✅ Registrar paciente →'}
          </button>
        </form>

        {/* Lista de registrados en esta sesión */}
        {registrados.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>
              Registrados esta sesión ({registrados.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {registrados.map((r, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
                  padding: '0.65rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{r.nombre} {r.apellido}</span>
                    {r.cedula && <span style={{ color: '#6B7280', fontSize: '0.85rem' }}> · {r.cedula}</span>}
                  </div>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6,
                    background: ESTADOS.find(e => e.val === r.estado)?.bg,
                    color: ESTADOS.find(e => e.val === r.estado)?.color,
                  }}>
                    {ESTADOS.find(e => e.val === r.estado)?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
