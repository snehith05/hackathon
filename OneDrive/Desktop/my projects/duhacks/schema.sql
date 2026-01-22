CREATE TABLE donor_profile (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    gender TEXT,
    age INTEGER,
    date_of_birth TEXT,
    occupation TEXT,
    guardian_name TEXT,
    mobile TEXT,
    email TEXT,
    address TEXT,

    has_donated_before BOOLEAN,
    donation_count INTEGER,
    last_donation_date TEXT,

    feeling_well_today BOOLEAN,
    ate_last_4_hours BOOLEAN,
    slept_well BOOLEAN,
    infection_risk BOOLEAN,
    alcohol_recent BOOLEAN
);

INSERT INTO donor_profile (
    name, gender, age, occupation, mobile,
    feeling_well_today, ate_last_4_hours, slept_well,
    infection_risk, alcohol_recent
) VALUES (
    'MK Subrahmanya', 'Male', 19, 'Student', '8951620905',
    1, 1, 1, 0, 0
);

SELECT * from donor_profile;
