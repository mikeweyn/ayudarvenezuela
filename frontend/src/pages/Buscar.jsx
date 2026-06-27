import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buscarPersonas } from '../api';
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
    if (q && q.length >= 2) buscar(q);
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

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setParams({ q: query.trim() });
    buscar(query.trim());
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>Buscar persona</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nombre, apellido o ambos..."
          autoFocus
        />
        <button type="submit" disabled={buscando || query.trim().length < 2}
          style={{ background: '#1A4A7A', color: '#fff', whiteSpace: 'nowrap' }}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #CC1B1B', borderRadius: 8, padding: '0.75rem', color: '#CC1B1B', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {buscado && (
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            {resultados.length === 0
              ? `No se encontraron resultados para "${params.get('q')}"`
              : `${resultados.length} resultado${resultados.length > 1 ? 's' : ''} para "${params.get('q')}"`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {resultados.map(p => <PersonaCard key={p.id} persona={p} />)}
          </div>

          {resultados.length === 0 && (
            <div className="card" style={{ marginTop: '1rem', background: '#EBF2FA', border: '1px solid #BDD5EA' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>¿No encontraste a quien buscas?</p>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>
                Puedes registrarlo/a para que otras personas puedan dejar información si lo/la ven.
              </p>
              <a href={`/reportar?tipo=familiar&nombre=${encodeURIComponent(query)}`}
                style={{ display: 'inline-block', background: '#1A4A7A', color: '#fff', padding: '0.6rem 1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>
                Registrar a {query}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
