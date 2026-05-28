DROP TABLE IF EXISTS user_table;

CREATE TABLE user_table (
    user_id SERIAL PRIMARY KEY NOT NULL,
    username TEXT;
)

CREATE TABLE group_table (
    group_id SERIAL PRIMARY KEY NOT NULL,
    group_name TEXT,
    group_password TEXT;
)

CREATE TABLE group_users (
    user_id INTEGER REFERENCES user_table(user_id),
    group_id INTEGER REFERENCES group_table(group_id);
)

CREATE TABLE drink_table (
    drink_id SERIAL PRIMARY KEY NOT NULL,
    drink_name TEXT,
    drink_amount INTEGER,
    date_added DATE;
)