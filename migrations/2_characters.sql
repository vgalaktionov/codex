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
    classes JSONB DEFAULT '[]',
    age TEXT,
    alignment TEXT NOT NULL,
    ideals TEXT,
    bonds TEXT,
    flaws TEXT,
    background TEXT,
    looks TEXT,
    image BYTEA,
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