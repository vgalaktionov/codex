CREATE OR REPLACE FUNCTION trigger_set_timestamp () RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();

RETURN NEW;

END;

$$ LANGUAGE PLPGSQL;

CREATE TABLE users (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  email text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL
);

CREATE TABLE "ownedContent" (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer REFERENCES USERS (id) NOT NULL,
  name text NOT NULL,
  "proofOfPurchasePath" text NOT NULL
);

CREATE TRIGGER set_timestamp_users BEFORE
UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TABLE rules (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer REFERENCES USERS (id) DEFAULT NULL,
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
  "campaignId" INTEGER REFERENCES campaigns(id) DEFAULT NULL,
  type TEXT NOT NULL DEFAULT 'd20',
  amount integer NOT NULL DEFAULT 1,
  result jsonb NOT NULL DEFAULT '[]'
);

CREATE TRIGGER set_timestamp_dicerolls BEFORE
UPDATE ON dicerolls FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TABLE characters (
  id serial PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT NOW(),
  "updatedAt" timestamptz NOT NULL DEFAULT NOW(),
  "userId" integer NOT NULL REFERENCES users ("id"),
  "campaignId" INTEGER NOT NULL REFERENCES campaigns(id),
  active BOOLEAN DEFAULT true,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  race TEXT NOT NULL,
  subrace TEXT,
  classes TEXT [] DEFAULT '{}'::text [],
  age TEXT,
  alignment TEXT NOT NULL,
  ideals TEXT,
  bonds TEXT,
  flaws TEXT,
  background TEXT,
  looks TEXT,
  imagePath TEXT,
  strength INTEGER NOT NULL,
  dexterity INTEGER NOT NULL,
  constitution INTEGER NOT NULL,
  intelligence INTEGER NOT NULL,
  wisdom INTEGER NOT NULL,
  charisma INTEGER NOT NULL,
  inventory JSONB DEFAULT '{}',
  spells JSONB DEFAULT '{}',
  UNIQUE("userId", "campaignId", name)
);

CREATE TRIGGER set_timestamp_characters BEFORE
UPDATE ON characters FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE UNIQUE INDEX active_character_campaign_user ON characters ("userId", "campaignId", active)
WHERE active;