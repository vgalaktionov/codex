CREATE OR REPLACE FUNCTION trigger_set_timestamp () RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();

RETURN NEW;

END;

$$ LANGUAGE PLPGSQL;

CREATE TABLE users (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  email text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL,
  "ownsContent" jsonb DEFAULT '{}'
);

CREATE TRIGGER set_timestamp_users BEFORE
UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TABLE rules (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer REFERENCES USERS (ID) DEFAULT NULL,
  category text NOT NULL,
  name text NOT NULL,
  rule jsonb DEFAULT '{}',
  description text,
  "descriptionSearch" tsvector GENERATED ALWAYS AS (to_tsvector('english', description)) STORED,
  UNIQUE ("userId", category, name)
);

CREATE TRIGGER set_timestamp_rules BEFORE
UPDATE ON rules FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE INDEX rules_search ON rules USING GIN ("descriptionSearch");

CREATE UNIQUE INDEX rules_user_bnull_unique ON rules (COALESCE("userId", 0), category, name);

CREATE TABLE campaigns (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer NOT NULL REFERENCES users ("id"),
  name text NOT NULL,
  description text,
  active boolean DEFAULT TRUE,
  UNIQUE("userId", name)
);

CREATE TRIGGER set_timestamp_campaigns BEFORE
UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE UNIQUE INDEX active_campaign_user ON campaigns ("userId", active)
WHERE active;

CREATE TABLE dicerolls (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer NOT NULL REFERENCES users ("id"),
  type TEXT NOT NULL DEFAULT 'd20',
  amount integer NOT NULL DEFAULT 1,
  result jsonb NOT NULL DEFAULT '[]'
);

CREATE TRIGGER set_timestamp_dicerolls BEFORE
UPDATE ON dicerolls FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();