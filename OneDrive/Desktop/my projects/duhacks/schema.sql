CREATE TABLE donor_profile (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    gender TEXT,
    age INTEGER,
    date_of_birth TEXT,
    occupation TEXT,
    mobile TEXT,
    email TEXT,
    address TEXT,

    has_donated_before BOOLEAN,
    donation_count INTEGER
);
INSERT INTO donor_profile (
    name,
    gender,
    age,
    date_of_birth,
    occupation,
    mobile,
    email,
    address,
    has_donated_before,
    donation_count
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
