import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarRecientes, listarPorEstado } from '../api';
import PersonaCard from '../components/PersonaCard';

const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    emoji: '🏚️',
    titulo: 'Terremoto 7.5 Mw — Venezuela',
    caption: 'San Felipe y Yaracuy — 24 de junio 2026',
  },
  {
    bg: 'linear-gradient(135deg, #2d0000 0%, #5c0000 50%, #8b0000 100%)',
    emoji: '🚒',
    titulo: '+920 fallecidos · +4.300 heridos',
    caption: 'Equipos de rescate operando en las zonas afectadas',
  },
  {
    bg: 'linear-gradient(135deg, #0d2137 0%, #1a4a7a 50%, #1e5f9e 100%)',
    emoji: '🤝',
    titulo: 'Ayuda humanitaria en curso',
    caption: 'Caracas · La Guaira · Yaracuy · Miranda',
  },
];

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const [recientes, setRecientes] = useState([]);
  const [desaparecidos, setDesaparecidos] = useState([]);
  const [slideActivo, setSlideActivo] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    listarRecientes().then(r => setRecientes(r.data)).catch(() => {});
    listarPorEstado('desaparecido').then(r => setDesaparecidos(r.data)).catch(() => {});
    const intervalo = setInterval(() => {
      setSlideActivo(f => (f + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    if (busqueda.trim().length >= 2) {
      navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`);
    }
  }

  return (
    <div style={{ paddingBottom: '3rem' }}>

      {/* Hero con buscador */}
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '2rem 1rem 2.5rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.4rem' }}>
            Busca o reporta personas<br />afectadas por el terremoto
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '1.5rem' }}>
            Venezuela · 24 de junio de 2026
          </p>
          <form onSubmit={handleBuscar}>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Escribe el nombre de quien buscas..."
              style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}
              autoFocus
            />
            <button type="submit"
              style={{ background: '#CC1B1B', color: '#fff', width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
              🔍 Buscar persona
            </button>
          </form>
        </div>
      </div>

      {/* Slider de situación — sin imágenes externas, sin parpadeo */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
        {SLIDES.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: slide.bg,
            opacity: i === slideActivo ? 1 : 0,
            transition: 'opacity 0.9s ease',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '1rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{slide.emoji}</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.3rem' }}>
              {slide.titulo}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
              📍 {slide.caption}
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '0.6rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideActivo(i)}
              style={{
                width: 8, height: 8, borderRadius: '50%', padding: 0, minHeight: 'unset',
                background: i === slideActivo ? '#FFD700' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer',
              }} />
          ))}
        </div>
      </div>

      {/* Estadísticas del terremoto */}
      <div style={{ background: '#1A4A7A', color: '#fff', padding: '1.25rem 1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFD700' }}>7.5</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Magnitud</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6B6B' }}>+920</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Fallecidos</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFD700' }}>+4300</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Heridos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="container" style={{ marginTop: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', color: '#4B5563', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          ¿Qué necesitas hacer?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>

          <Link to="/reportar?tipo=yo_mismo">
            <div style={{
              background: '#fff', border: '2px solid #1A7A3A', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A7A3A' }}>Estoy vivo/a y estoy bien</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Avisa a tu familia que estás a salvo
                </div>
              </div>
            </div>
          </Link>

          <Link to="/reportar?tipo=familiar">
            <div style={{
              background: '#fff', border: '2px solid #CC1B1B', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>🔍</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#CC1B1B' }}>Busco a un familiar</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Reporta a alguien que no has podido contactar
                </div>
              </div>
            </div>
          </Link>

          <Link to="/reportar?tipo=testigo">
            <div style={{
              background: '#fff', border: '2px solid #1A4A7A', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>👁️</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A4A7A' }}>Vi a alguien y tengo información</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  Informa sobre alguien que viste o encontraste
                </div>
              </div>
            </div>
          </Link>

          <Link to="/subir-lista">
            <div style={{
              background: '#fff', border: '2px solid #7C3AED', borderRadius: 14,
              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2.5rem' }}>📷</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#7C3AED' }}>Subir foto de lista</div>
                <div style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                  La IA lee los nombres automáticamente
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Números de emergencia — widget compacto */}
        <div style={{
          background: '#CC1B1B', borderRadius: 14, padding: '1rem 1.25rem',
          marginBottom: '1.5rem', color: '#fff',
        }}>
          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem' }}>
            🆘 Números de emergencia — toca para llamar
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { num: '911', label: 'Emergencia' },
              { num: '0800-RESCATE', label: 'Rescate' },
              { num: '166', label: 'Prot. Civil' },
              { num: '167', label: 'Bomberos' },
            ].map(e => (
              <a key={e.num} href={`tel:${e.num.replace(/-/g,'')}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '0.6rem 0.75rem',
                  textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>{e.num}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>{e.label}</div>
                </div>
              </a>
            ))}
          </div>
          <Link to="/emergencias" style={{
            display: 'block', textAlign: 'center', marginTop: '0.75rem',
            color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 600,
          }}>
            Ver todos los números →
          </Link>
        </div>

        {/* Desaparecidos */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            background: '#FFF3CD', border: '2px solid #856404', borderRadius: 12,
            padding: '0.75rem 1rem', marginBottom: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔎</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#856404' }}>
                {desaparecidos.length > 0
                  ? `${desaparecidos.length} personas desaparecidas reportadas`
                  : 'Personas desaparecidas'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6c5700' }}>
                {desaparecidos.length > 0
                  ? 'Sus familias las están buscando — si sabes algo, haz clic en su nombre'
                  : 'Si no encuentras a un familiar, repórtalo como desaparecido usando el botón "Reportar"'}
              </div>
            </div>
          </div>
          {desaparecidos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {desaparecidos.slice(0, 15).map(per => (
                <PersonaCard key={per.id} persona={per} />
              ))}
            </div>
          )}
          {desaparecidos.length > 15 && (
            <Link to="/buscar?estado=desaparecido">
              <button style={{ width: '100%', marginTop: '0.75rem', background: '#856404', color: '#fff' }}>
                Ver los {desaparecidos.length} desaparecidos →
              </button>
            </Link>
          )}
        </div>

        {/* Registros recientes */}
        {recientes.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#374151' }}>
              Registros recientes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recientes.slice(0, 10).map(p => (
                <PersonaCard key={p.id} persona={p} />
              ))}
            </div>
          </div>
        )}

        {recientes.length === 0 && desaparecidos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋</div>
            <p style={{ fontSize: '1rem' }}>Cargando registros...</p>
          </div>
        )}
      </div>
    </div>
  );
}
