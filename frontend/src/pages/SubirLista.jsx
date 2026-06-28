import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function SubirLista() {
  const [hospital] = useState(() => localStorage.getItem('hospital_nombre') || '');
  const [imagen, setImagen]       = useState(null);
  const [preview, setPreview]     = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError]         = useState('');

  function handleFile(file) {
    if (!file) return;
    setImagen(file);
    setResultado(null);
    setError('');
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  async function procesar() {
    if (!imagen) return;
    setProcesando(true);
    setError('');
    try {
      const form = new FormData();
      form.append('imagen', imagen);
      form.append('hospital', hospital || 'Lista hospitalaria');
      const { data } = await api.post('/api/listas/subir', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setResultado(data);
    } catch (e) {
      const msg = e?.response?.data?.error || '';
      const motivo = e?.response?.data?.motivo || '';
      if (msg.includes('lista de pacientes')) {
        setError(`⚠️ ${msg}${motivo ? ' ' + motivo : ''}`);
      } else if (msg.includes('Límite')) {
        setError('⏱️ ' + msg);
      } else {
        setError('Error al procesar la imagen. Verificá que sea legible e intentá de nuevo.');
      }
    } finally {
      setProcesando(false);
    }
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '1rem' }}>
        <div className="container">
          <Link to="/hospital" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>← Hospital</Link>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.4rem' }}>📷 Subir lista</h1>
          <p style={{ opacity: 0.8, fontSize: '0.88rem', marginTop: '0.2rem' }}>
            La IA lee los nombres automáticamente
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '1.5rem' }}>

        {!resultado ? (
          <>
            <label style={{
              display: 'block', border: `2px dashed ${preview ? '#1A4A7A' : '#D1D5DB'}`,
              borderRadius: 14, padding: preview ? '0.5rem' : '2.5rem 1rem',
              textAlign: 'center', cursor: 'pointer',
              background: preview ? '#000' : '#F9FAFB', marginBottom: '1rem',
            }}>
              <input type="file" accept="image/*" capture="environment"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])} />
              {preview
                ? <img src={preview} alt="Lista" style={{ maxWidth: '100%', maxHeight: 420, borderRadius: 8, objectFit: 'contain' }} />
                : <>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
                    <div style={{ fontWeight: 700, color: '#374151', fontSize: '1.05rem' }}>
                      Tocar para sacar foto o elegir imagen
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
                      Podés fotografiar una lista escrita a mano
                    </div>
                  </>
              }
            </label>

            {preview && !procesando && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <button onClick={() => { setImagen(null); setPreview(null); }}
                  style={{ flex: 1, background: '#F3F4F6', color: '#374151' }}>
                  Cambiar foto
                </button>
                <button onClick={procesar}
                  style={{ flex: 2, background: '#1A4A7A', color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                  🤖 Procesar lista →
                </button>
              </div>
            )}

            {procesando && (
              <div style={{ textAlign: 'center', padding: '2rem', background: '#EBF2FA', borderRadius: 12 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤖</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A4A7A' }}>Leyendo la lista...</div>
                <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                  La IA está identificando los nombres. Puede tardar 15-20 segundos.
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: '#FFF0F0', border: '1.5px solid #CC1B1B', borderRadius: 8, padding: '0.85rem', color: '#CC1B1B' }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{
              background: '#EBF7EF', border: '2px solid #1A7A3A', borderRadius: 12,
              padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem' }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1A7A3A' }}>
                {resultado.importados} personas registradas
              </div>
              <div style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {hospital || 'Lista hospitalaria'}
              </div>
            </div>

            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#374151' }}>
              Personas detectadas ({resultado.personas.length}):
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem' }}>
              {resultado.personas.map((p, i) => (
                <div key={i} style={{
                  background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
                  padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 700 }}>{p.nombre} {p.apellido}</span>
                  {p.ubicacion && <span style={{ color: '#6B7280', fontSize: '0.82rem' }}>📍 {p.ubicacion}</span>}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setResultado(null); setPreview(null); setImagen(null); }}
                style={{ flex: 1, background: '#1A4A7A', color: '#fff', fontWeight: 800 }}>
                📷 Subir otra lista
              </button>
              <Link to="/hospital" style={{ flex: 1, display: 'block' }}>
                <button style={{ width: '100%', background: '#F3F4F6', color: '#374151' }}>
                  ← Hospital
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
