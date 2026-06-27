import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buscarPersonas, listarPorEstado } from '../api';
import PersonaCard from '../components/PersonaCard';

export default function Buscar() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    const q = params.get('q');
    const estado = params.get('estado');
    if (q && q.length >= 2) {
      buscar(q);
    } else if (estado) {
      cargarPorEstado(estado);
    }
  }, []);

  async function buscar(q) {
    setBuscando(true);
    setError('');
    try {
      const { data } = await buscarPersonas(q);
      setResultados(data);
      setBuscado(true);
    } catch {
      setError('Error al buscar. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  async function cargarPorEstado(estado) {
    setBuscando(true);
    setError('');
    try {
      const { data } = await listarPorEstado(estado);
      setResultados(data);
      setBuscado(true);
    } catch {
      setError('Error al cargar. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setParams({ q: query.trim() });
    buscar(query.trim());
  }

  const estadoFiltro = params.get('estado');

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
        {estadoFiltro === 'desaparecido' ? '🔎 Personas desaparecidas' : '🔍 Buscar persona'}
      </h1>

      {!estadoFiltro && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Escribe el nombre y apellido..."
            style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}
            autoFocus
          />
          <button type="submit" disabled={buscando || query.trim().length < 2}
            style={{ background: '#1A4A7A', color: '#fff', width: '100%', fontSize: '1.1rem' }}>
            {buscando ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </form>
      )}

      {estadoFiltro === 'desaparecido' && (
        <div style={{
          background: '#FFF3CD', border: '2px solid #856404', borderRadius: 10,
          padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.95rem', color: '#6c5700'
        }}>
          Si sabes dónde está alguna de estas personas, haz clic en su nombre y deja un aviso.
        </div>
      )}

      {error && (
        <div style={{ background: '#fff0f0', border: '2px solid #CC1B1B', borderRadius: 10, padding: '1rem', color: '#CC1B1B', marginBottom: '1rem', fontSize: '1rem' }}>
          {error}
        </div>
      )}

      {buscando && (
        <p style={{ color: '#6B7280', fontSize: '1rem', textAlign: 'center', padding: '2rem' }}>Buscando...</p>
      )}

      {buscado && !buscando && (
        <div>
          <p style={{ fontSize: '1rem', color: '#4B5563', marginBottom: '1rem', fontWeight: 600 }}>
            {resultados.length === 0
              ? estadoFiltro
                ? 'No hay personas desaparecidas registradas aún.'
                : `No encontramos a "${params.get('q')}"`
              : estadoFiltro
                ? `${resultados.length} persona${resultados.length > 1 ? 's' : ''} reportada${resultados.length > 1 ? 's' : ''} como desaparecida${resultados.length > 1 ? 's' : ''}`
                : `Se encontraron ${resultados.length} resultado${resultados.length > 1 ? 's' : ''} para "${params.get('q')}"`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resultados.map(p => <PersonaCard key={p.id} persona={p} />)}
          </div>

          {resultados.length === 0 && !estadoFiltro && (
            <div className="card" style={{ marginTop: '1rem', background: '#EBF2FA', border: '2px solid #BDD5EA' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                ¿No encontraste a quien buscas?
              </p>
              <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Puedes registrarlo para que otros puedan dejar información si lo ven.
              </p>
              <a href={`/reportar?tipo=familiar&nombre=${encodeURIComponent(query)}`}
                style={{ display: 'block', background: '#1A4A7A', color: '#fff', padding: '1rem', borderRadius: 10, fontWeight: 700, fontSize: '1.05rem', textAlign: 'center' }}>
                Registrar a {query}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
