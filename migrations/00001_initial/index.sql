CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    email TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "ownsContent" jsonb default '{}'
);


CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

create table rules(
    id SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    "userId" INTEGER REFERENCES USERS(ID) DEFAULT NULL,

    category TEXT NOT NULL,
    name TEXT NOT NULL,
    rule jsonb DEFAULT '{}',
    description TEXT,
    "descriptionSearch" TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', description)) STORED,

    UNIQUE("userId", category, name)
);

CREATE TRIGGER set_timestamp_rules
BEFORE UPDATE ON rules
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE INDEX rules_search ON rules USING GIN ("descriptionSearch");