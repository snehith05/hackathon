const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize database connection
const dbPath = path.join(__dirname, '../../../donor.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// ========================
// USER MODEL OPERATIONS
// ========================

/**
 * Create a new user
 */
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { role, fullName, email, password, phone, location, bloodGroup, collegeId, collegeName, hospitalLicense } = userData;
    
    const query = `
      INSERT INTO users (role, fullName, email, password, phone, location, bloodGroup, collegeId, collegeName, hospitalLicense)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [role || 'pending', fullName, email, password, phone, location, bloodGroup, collegeId, collegeName, hospitalLicense];
    
    db.run(query, values, function(err) {
      if (err) reject(err);
      resolve({ id: this.lastID, ...userData });
    });
  });
};

/**
 * Get user by ID
 */
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [userId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

/**
 * Get user by email
 */
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

/**
 * Get all users with optional filters
 */
const getAllUsers = (filters = {}) => {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];
    
    if (filters.role) {
      query += ' AND role = ?';
      values.push(filters.role);
    }
    if (filters.bloodGroup) {
      query += ' AND bloodGroup = ?';
      values.push(filters.bloodGroup);
    }
    if (filters.isAvailable !== undefined) {
      query += ' AND isAvailable = ?';
      values.push(filters.isAvailable ? 1 : 0);
    }
    
    db.all(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
};

/**
 * Update user
 */
const updateUser = (userId, updates) => {
  return new Promise((resolve, reject) => {
    const allowedFields = ['role', 'fullName', 'phone', 'location', 'bloodGroup', 'lastDonationDate', 'isAvailable', 'collegeId', 'collegeName', 'hospitalLicense', 'isProfileComplete'];
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      resolve({ message: 'No valid fields to update' });
      return;
    }
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(userId);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) reject(err);
      resolve({ id: userId, ...updates });
    });
  });
};

/**
 * Delete user
 */
const deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM users WHERE id = ?';
    db.run(query, [userId], function(err) {
      if (err) reject(err);
      resolve({ message: `User ${userId} deleted`, changes: this.changes });
    });
  });
};

// ========================
// DONATION DATA MODEL OPERATIONS
// ========================

/**
 * Create a new donation request
 */
const createDonationRequest = (donationData) => {
  return new Promise((resolve, reject) => {
    const { userId, donationDate, bloodGroupNeeded, quantity, location, urgency, status, reason } = donationData;
    
    const query = `
      INSERT INTO donationData (userId, donationDate, bloodGroupNeeded, quantity, location, urgency, status, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [userId, donationDate, bloodGroupNeeded, quantity, location, urgency, status || 'pending', reason];
    
    db.run(query, values, function(err) {
      if (err) reject(err);
      resolve({ id: this.lastID, ...donationData });
    });
  });
};

/**
 * Get donation request by ID
 */
const getDonationById = (donationId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT dd.*, u.fullName, u.email, u.phone, u.location as userLocation
      FROM donationData dd
      JOIN users u ON dd.userId = u.id
      WHERE dd.id = ?
    `;
    db.get(query, [donationId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

/**
 * Get all donation requests with optional filters
 */
const getAllDonations = (filters = {}) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT dd.*, u.fullName, u.email, u.phone, u.bloodGroup, u.location as userLocation
      FROM donationData dd
      JOIN users u ON dd.userId = u.id
      WHERE 1=1
    `;
    const values = [];
    
    if (filters.status) {
      query += ' AND dd.status = ?';
      values.push(filters.status);
    }
    if (filters.bloodGroupNeeded) {
      query += ' AND dd.bloodGroupNeeded = ?';
      values.push(filters.bloodGroupNeeded);
    }
    if (filters.urgency) {
      query += ' AND dd.urgency = ?';
      values.push(filters.urgency);
    }
    if (filters.userId) {
      query += ' AND dd.userId = ?';
      values.push(filters.userId);
    }
    
    query += ' ORDER BY dd.createdAt DESC';
    
    db.all(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
};

/**
 * Get donations by user ID
 */
const getDonationsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM donationData WHERE userId = ? ORDER BY createdAt DESC';
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
};

/**
 * Update donation request
 */
const updateDonation = (donationId, updates) => {
  return new Promise((resolve, reject) => {
    const allowedFields = ['donationDate', 'bloodGroupNeeded', 'quantity', 'location', 'urgency', 'status', 'reason'];
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      resolve({ message: 'No valid fields to update' });
      return;
    }
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(donationId);
    
    const query = `UPDATE donationData SET ${fields.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) reject(err);
      resolve({ id: donationId, ...updates });
    });
  });
};

/**
 * Delete donation request
 */
const deleteDonation = (donationId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM donationData WHERE id = ?';
    db.run(query, [donationId], function(err) {
      if (err) reject(err);
      resolve({ message: `Donation ${donationId} deleted`, changes: this.changes });
    });
  });
};

/**
 * Get available donors for a blood group
 */
const getAvailableDonors = (bloodGroup) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users 
      WHERE bloodGroup = ? 
      AND isAvailable = 1 
      AND role IN ('donor', 'admin')
      ORDER BY lastDonationDate ASC
    `;
    db.all(query, [bloodGroup], (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
};

/**
 * Get donation statistics
 */
const getDonationStats = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(*) as totalDonations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedDonations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingDonations,
        COUNT(CASE WHEN status = 'urgent' THEN 1 END) as urgentDonations
      FROM donationData
    `;
    db.get(query, [], (err, row) => {
      if (err) reject(err);
      resolve(row || {});
    });
  });
};

// ========================
// EXPORT
// ========================

module.exports = {
  db,
  // User operations
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
  // Donation operations
  createDonationRequest,
  getDonationById,
  getAllDonations,
  getDonationsByUserId,
  updateDonation,
  deleteDonation,
  getAvailableDonors,
  getDonationStats
};
