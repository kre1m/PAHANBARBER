const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./barber.db', (err) => {
  if (err) {
    console.error('Ошибка подключения:', err);
    return;
  }
  
  console.log('=== ПОЛЬЗОВАТЕЛИ ===');
  db.all('SELECT id, email, firstName, lastName, role FROM users', (err, users) => {
    if (err) {
      console.error('Ошибка:', err);
      return;
    }
    console.table(users);
    
    console.log('\n=== ВСЕ ЗАПИСИ ===');
    db.all('SELECT id, userId, date, time, status FROM appointments', (err, apts) => {
      if (err) {
        console.error('Ошибка:', err);
        return;
      }
      console.table(apts);
      
      console.log('\n=== ЗАПИСИ ПО ПОЛЬЗОВАТЕЛЯМ ===');
      users.forEach(user => {
        db.all('SELECT id, userId, date, time FROM appointments WHERE userId = ?', [user.id], (err, apts) => {
          if (!err) {
            console.log(`\nПользователь: ${user.email} (ID: ${user.id}) - записей: ${apts.length}`);
            console.table(apts);
          }
          if (users[users.length - 1].id === user.id && apts) {
            db.close();
          }
        });
      });
    });
  });
});
