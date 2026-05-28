DROP TABLE IF EXISTS user_table;
DROP TABLE IF EXISTS group_table;
DROP TABLE IF EXISTS group_users;
DROP TABLE IF EXISTS drink_table;
DROP TABLE IF EXISTS drink_amount;
DROP TABLE IF EXISTS drink_tally;

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

CREATE TABLE drink_table (
    drink_id SERIAL PRIMARY KEY NOT NULL,
    drink_name TEXT,
    drink_amount INTEGER,
);

CREATE TABLE drink_tally (
    user_id INTEGER REFERENCES user_table(user_id),
    drink_id INTEGER REFERENCES drink_table(drink_id),
    date_added DATE
);