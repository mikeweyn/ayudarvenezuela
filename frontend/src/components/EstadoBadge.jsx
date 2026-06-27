const LABELS = {
  bien: 'Está bien',
  herido: 'Herido/a',
  desaparecido: 'Desaparecido/a',
  fallecido: 'Fallecido/a',
  desconocido: 'Sin información',
};

export default function EstadoBadge({ estado }) {
  return (
    <span className={`badge badge-${estado}`}>
      {LABELS[estado] || estado}
    </span>
  );
}
