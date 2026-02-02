#!/usr/bin/env node
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'barber.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
  
  const result = {};
  
  // Get users
  db.all('SELECT id, email, firstName, lastName, role FROM users ORDER BY id', (err, users) => {
    if (err) {
      console.error('ERROR_USERS', err.message);
      db.close();
      process.exit(1);
    }
    
    result.users = users || [];
    
    // Get appointments
    db.all('SELECT id, userId, date, time, status FROM appointments ORDER BY userId, date DESC', (err, apts) => {
      if (err) {
        console.error('ERROR_APTS', err.message);
        db.close();
        process.exit(1);
      }
      
      result.appointments = apts || [];
      
      // Output as JSON
      console.log(JSON.stringify(result, null, 2));
      
      db.close();
    });
  });
});
