DROP TABLE IF EXISTS user_table CASCADE;
DROP TABLE IF EXISTS group_table CASCADE;
DROP TABLE IF EXISTS group_users CASCADE;

CREATE TABLE user_table (
    user_id SERIAL PRIMARY KEY NOT NULL,
    username TEXT
);

CREATE TABLE group_table (
    group_id SERIAL PRIMARY KEY NOT NULL,
    group_name TEXT,
    group_password TEXT
);

CREATE TABLE group_users (
    user_id INTEGER REFERENCES user_table(user_id),
    group_id INTEGER REFERENCES group_table(group_id)
);

