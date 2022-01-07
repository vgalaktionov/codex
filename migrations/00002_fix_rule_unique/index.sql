CREATE UNIQUE INDEX rules_user_bnull_unique ON rules (COALESCE("userId", 0), category, name);
