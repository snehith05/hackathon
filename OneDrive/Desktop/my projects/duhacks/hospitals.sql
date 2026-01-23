CREATE TABLE bloodBanks (
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
    Emergency Services BOOLEAN DEFAULT 0,
    Operating Hours TEXT
    );
INSERT INTO bloodBanks (
    name,
    location,
    latitude,
    longitude,
    contactNumber,
    email,
    licenseNumber,
    capcity,
    availableBloodUnits,
    Emergency Services,
    Operating Hours
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); 