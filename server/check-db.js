const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'barber.db');
console.log('📂 Проверяем БД:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения:', err);
    process.exit(1);
  }
  
  console.log('\n=== ПОЛЬЗОВАТЕЛИ В БД ===');
  db.all('SELECT id, email, firstName, lastName, role FROM users ORDER BY id', (err, users) => {
    if (err) {
      console.error('❌ Ошибка:', err);
      db.close();
      return;
    }
    
    if (users.length === 0) {
      console.log('❌ Нет пользователей в БД!');
    } else {
      console.table(users);
    }
    
    console.log('\n=== ВСЕ ЗАПИСИ (appointments) ===');
    db.all('SELECT id, userId, date, time, status FROM appointments ORDER BY userId, date DESC', (err, apts) => {
      if (err) {
        console.error('❌ Ошибка:', err);
        db.close();
        return;
      }
      
      if (apts.length === 0) {
        console.log('❌ Нет записей в БД!');
      } else {
        console.table(apts);
        
        console.log('\n=== ЗАПИСИ ПО ПОЛЬЗОВАТЕЛЯМ ===');
        const userIds = [...new Set(apts.map(a => a.userId))];
        userIds.forEach(userId => {
          const userApts = apts.filter(a => a.userId === userId);
          const user = users.find(u => u.id === userId);
          console.log(`\n👤 ${user?.email} (ID: ${userId}) - ${userApts.length} запис(ей):`);
          userApts.forEach(apt => {
            console.log(`   - ${apt.date} ${apt.time} (status: ${apt.status})`);
          });
        });
      }
      
      db.close();
      console.log('\n✅ Анализ завершен\n');
    });
  });
});
