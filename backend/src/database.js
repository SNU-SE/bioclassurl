const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_code TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      clicks INTEGER DEFAULT 0
    )
  `);
}

function saveUrl(originalUrl, shortCode) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO urls (original_url, short_code) VALUES (?, ?)',
      [originalUrl, shortCode],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

function getUrlByShortCode(shortCode) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM urls WHERE short_code = ?',
      [shortCode],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

function incrementClicks(shortCode) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
      [shortCode],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}

function getAllUrls() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM urls ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  saveUrl,
  getUrlByShortCode,
  incrementClicks,
  getAllUrls,
  close: () => db.close()
};
