import { useState, useEffect, useRef } from 'react';
import api from '../api';

function formatFecha(iso) {
  return new Date(iso).toLocaleString('es-VE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function NoticiaCard({ n }) {
  const [expandida, setExpandida] = useState(false);
  return (
    <div className="card" style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
      {n.imagen && (
        <img src={n.imagen} alt={n.titulo}
          style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }} />
      )}
      <div style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.4rem', color: '#111827' }}>
          {n.titulo}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '0.5rem' }}>
          {expandida ? n.contenido : n.contenido.slice(0, 150) + (n.contenido.length > 150 ? '...' : '')}
        </p>
        {n.contenido.length > 150 && (
          <button onClick={() => setExpandida(e => !e)}
            style={{ background: 'none', color: '#1A4A7A', fontWeight: 700, fontSize: '0.85rem', padding: 0, minHeight: 'unset' }}>
            {expandida ? 'Ver menos ▲' : 'Ver más ▼'}
          </button>
        )}
        {n.fuente && (
          <div style={{ marginTop: '0.6rem' }}>
            <a href={n.fuente} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#1A4A7A', color: '#fff', borderRadius: 8, padding: '0.4rem 0.85rem', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
              🔗 Más información →
            </a>
          </div>
        )}
        <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#9CA3AF' }}>
          {n.autor} · {formatFecha(n.created_at)}
        </div>
      </div>
    </div>
  );
}

function FormPublicar({ onPublicada }) {
  const vacio = { titulo: '', contenido: '', autor: '', fuente: '' };
  const [form, setForm]       = useState(vacio);
  const [imagen, setImagen]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError]     = useState('');

  function handleImg(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('La imagen no puede superar 2MB.'); return; }
    setImagen(file);
    const r = new FileReader();
    r.onload = e => setPreview(e.target.result);
    r.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim() || !form.autor.trim()) {
      setError('Título, contenido y tu nombre son obligatorios.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imagen) fd.append('imagen', imagen);
      await api.post('/api/noticias', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(vacio);
      setImagen(null);
      setPreview(null);
      onPublicada();
    } catch {
      setError('Error al publicar. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="campo">
        <label>Título *</label>
        <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          placeholder="Ej: Refugio en Escuela Simón Bolívar recibe donaciones" />
      </div>
      <div className="campo">
        <label>Contenido *</label>
        <textarea value={form.contenido} onChange={e => setForm(f => ({ ...f, contenido: e.target.value }))}
          placeholder="Escribí la información que querés compartir..." rows={4} style={{ resize: 'vertical' }} />
      </div>
      <div className="campo">
        <label>Imagen (opcional, máx 2MB)</label>
        <label style={{ display: 'block', border: '2px dashed #D1D5DB', borderRadius: 10, padding: '0.75rem', textAlign: 'center', cursor: 'pointer', background: '#F9FAFB' }}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImg(e.target.files[0])} />
          {preview
            ? <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, objectFit: 'contain' }} />
            : <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>📷 Tocar para agregar imagen</span>
          }
        </label>
      </div>
      <div className="campo">
        <label>Enlace externo (opcional)</label>
        <input value={form.fuente} onChange={e => setForm(f => ({ ...f, fuente: e.target.value }))}
          placeholder="https://..." type="url" />
      </div>
      <div className="campo">
        <label>Tu nombre o fuente *</label>
        <input value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))}
          placeholder="Ej: Cruz Roja Venezuela, @usuario, tu nombre" />
      </div>
      {error && <div style={{ background: '#FFF0F0', border: '1.5px solid #CC1B1B', borderRadius: 8, padding: '0.75rem', color: '#CC1B1B', fontSize: '0.9rem' }}>{error}</div>}
      <button type="submit" disabled={enviando}
        style={{ background: enviando ? '#6B7280' : '#1A4A7A', color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
        {enviando ? 'Publicando...' : '📢 Publicar noticia'}
      </button>
    </form>
  );
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const formRef = useRef();

  async function cargar() {
    try {
      const { data } = await api.get('/api/noticias');
      setNoticias(data);
    } catch {}
    finally { setCargando(false); }
  }

  useEffect(() => { cargar(); }, []);

  function onPublicada() {
    setMostrarForm(false);
    cargar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '1rem 1rem 1.25rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📰 Noticias</h1>
            <p style={{ opacity: 0.8, fontSize: '0.88rem', marginTop: '0.2rem' }}>Información y ayuda humanitaria</p>
          </div>
          <button onClick={() => { setMostrarForm(v => !v); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            style={{ background: '#CC1B1B', color: '#fff', fontWeight: 800, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            {mostrarForm ? '✕ Cerrar' : '+ Publicar'}
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '1.25rem' }}>
        {mostrarForm && (
          <div ref={formRef} className="card" style={{ marginBottom: '1.5rem', borderColor: '#1A4A7A', borderWidth: 2 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#1A4A7A' }}>
              📢 Publicar información
            </h2>
            <FormPublicar onPublicada={onPublicada} />
          </div>
        )}

        {cargando && <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>Cargando...</div>}

        {!cargando && noticias.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📰</div>
            <div>No hay noticias aún. ¡Sé el primero en publicar!</div>
          </div>
        )}

        {noticias.map(n => <NoticiaCard key={n.id} n={n} />)}
      </div>
    </div>
  );
}
