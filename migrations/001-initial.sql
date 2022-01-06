CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    ownsContent TEXT
);

CREATE TABLE rules(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER REFERENCES users(id) DEFAULT NULL,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    rule TEXT DEFAULT '{}',
    description TEXT,

    UNIQUE(userId, category, name)
);

-- As SQLite index content on a virtual table,
-- We need to create a virtual table for hotels_reviews
-- I use the last extension fts5 for full text searching https://www.sqlite.org/fts5.html
-- I use the "porter" tokenizer, check this link for definition: https://www.sqlite.org/fts3.html#tokenizer
CREATE VIRTUAL TABLE rulesIndex USING fts5(description, tokenize=porter);

-- We need to keep the two table hotels_reviews and hotels reviews_index in sync,
-- as we add or update or delete, trigger can do the trick
-- rowid is a special column on the virtual table that store the unique value of the row, in our example we use the same primary key of hotels_reviews
-- Trigger on CREATE
CREATE TRIGGER afterRulesInsert AFTER INSERT ON rules BEGIN
INSERT INTO rulesIndex (
    rowid,
    description
)
VALUES(
    new.id,
    new.description
);
END;

-- Trigger on UPDATE
CREATE TRIGGER afterRulesUpdate UPDATE OF description ON rules BEGIN
UPDATE rulesIndex SET description = new.description WHERE rowid = old.id;
END;

-- Trigger on DELETE
CREATE TRIGGER afterRulesDelete AFTER DELETE ON rules BEGIN
    DELETE FROM rulesIndex WHERE rowid = old.id;
END;