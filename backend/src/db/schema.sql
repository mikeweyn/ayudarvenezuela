-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Tipos enumerados
CREATE TYPE estado_persona AS ENUM ('bien', 'herido', 'desaparecido', 'fallecido', 'desconocido');
CREATE TYPE tipo_registro AS ENUM ('yo_mismo', 'familiar', 'testigo');

-- Tabla principal de personas
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  estado estado_persona NOT NULL DEFAULT 'desconocido',
  ultima_ubicacion TEXT,
  mensaje TEXT,
  contacto TEXT,
  foto_url TEXT,
  registrado_por TEXT NOT NULL,
  tipo_registro tipo_registro NOT NULL DEFAULT 'familiar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda de texto por nombre y apellido
CREATE INDEX IF NOT EXISTS idx_personas_nombre_trgm ON personas USING GIN ((nombre || ' ' || apellido) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_personas_created_at ON personas (created_at DESC);

-- Tabla de avisos (info de terceros sobre una persona)
CREATE TABLE IF NOT EXISTS avisos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
  autor TEXT NOT NULL,
  texto TEXT NOT NULL,
  ubicacion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_avisos_persona_id ON avisos (persona_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personas_updated_at
  BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
