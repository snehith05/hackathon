-- Blood Bank Schema
CREATE TABLE IF NOT EXISTS bloodBanks (
    name TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    contactNumber TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    licenseNumber TEXT NOT NULL UNIQUE,
    capcity INTEGER NOT NULL,
    availableBloodUnits INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    apheresisFacility BOOLEAN DEFAULT 0,
    emergencyServices BOOLEAN DEFAULT 0,
    operatingHours TEXT
);

-- Donor Profile Schema
CREATE TABLE IF NOT EXISTS donor_profile (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT,
    age INTEGER,
    date_of_birth TEXT,
    occupation TEXT,
    mobile TEXT,
    email TEXT,
    address TEXT,
    has_donated_before BOOLEAN,
    donation_count INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hospital Schema (separate functionality)
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    contactNumber TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    totalBeds INTEGER NOT NULL,
    availableBeds INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    emergencyDept BOOLEAN DEFAULT 0,
    operatingHours TEXT
);

-- Blood Inventory (tracks blood units in detail)
CREATE TABLE IF NOT EXISTS blood_inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bloodbank_name TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_date TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bloodbank_name) REFERENCES bloodBanks(name)
);

-- Hospital Blood Request (hospitals request from blood banks)
CREATE TABLE IF NOT EXISTS hospital_blood_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospital_id INTEGER NOT NULL,
    bloodbank_name TEXT NOT NULL,
    blood_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    request_status TEXT DEFAULT 'PENDING',
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    fulfillment_date DATETIME,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id),
    FOREIGN KEY (bloodbank_name) REFERENCES bloodBanks(name)
);

-- Donor Donation History
CREATE TABLE IF NOT EXISTS donation_history (
    donation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    bloodbank_name TEXT NOT NULL,
    blood_type TEXT,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER,
    FOREIGN KEY (donor_id) REFERENCES donor_profile(donor_id),
    FOREIGN KEY (bloodbank_name) REFERENCES bloodBanks(name)
);
