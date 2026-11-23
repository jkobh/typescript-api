CREATE FUNCTION coffee_touch() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TABLE standorte (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name text NOT NULL,
  ort text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE maschinen (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  modell text NOT NULL,
  standort_id uuid NOT NULL UNIQUE REFERENCES standorte (id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE kaffeebohnen (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  sorte text NOT NULL,
  maschine_id uuid NOT NULL REFERENCES maschinen (id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX kaffeebohnen_maschine_id_idx ON kaffeebohnen (maschine_id);
CREATE INDEX standorte_deleted_at_idx ON standorte (deleted_at);
CREATE INDEX maschinen_deleted_at_idx ON maschinen (deleted_at);
CREATE INDEX kaffeebohnen_deleted_at_idx ON kaffeebohnen (deleted_at);

CREATE TRIGGER standorte_touch BEFORE UPDATE ON standorte
FOR EACH ROW EXECUTE FUNCTION coffee_touch();

CREATE TRIGGER maschinen_touch BEFORE UPDATE ON maschinen
FOR EACH ROW EXECUTE FUNCTION coffee_touch();

CREATE TRIGGER kaffeebohnen_touch BEFORE UPDATE ON kaffeebohnen
FOR EACH ROW EXECUTE FUNCTION coffee_touch();