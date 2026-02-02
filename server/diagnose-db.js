const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('\n📊 === ДИАГНОСТИКА БД PAHAN BARBER === \n');

const dbPath = path.join(__dirname, 'barber.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Подключено к БД:', dbPath);
  console.log('');
  
  // Получаем пользователей
  db.all('SELECT id, email, firstName, lastName, role FROM users ORDER BY id', (err, users) => {
    if (err) {
      console.error('❌ Ошибка при запросе users:', err);
      db.close();
      process.exit(1);
    }
    
    console.log('👤 ПОЛЬЗОВАТЕЛИ:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (!users || users.length === 0) {
      console.log('❌ В БД нет пользователей!');
    } else {
      users.forEach((user, idx) => {
        console.log(`${idx + 1}. ID: ${user.id} | Email: ${user.email} | Name: ${user.firstName} ${user.lastName} | Role: ${user.role}`);
      });
    }
    
    console.log('');
    
    // Получаем записи
    db.all('SELECT id, userId, date, time, status FROM appointments ORDER BY userId, date DESC', (err, apts) => {
      if (err) {
        console.error('❌ Ошибка при запросе appointments:', err);
        db.close();
        process.exit(1);
      }
      
      console.log('📅 ЗАПИСИ (appointments):');
      console.log('═══════════════════════════════════════════════════════════════');
      
      if (!apts || apts.length === 0) {
        console.log('⚠️  В БД нет записей');
      } else {
        apts.forEach((apt, idx) => {
          const user = users.find(u => u.id === apt.userId);
          const userEmail = user ? user.email : `UNKNOWN (ID: ${apt.userId})`;
          console.log(`${idx + 1}. Запись ID: ${apt.id} | User: ${userEmail} | Дата: ${apt.date} ${apt.time} | Статус: ${apt.status}`);
        });
      }
      
      console.log('');
      console.log('📊 АНАЛИЗ:');
      console.log('═══════════════════════════════════════════════════════════════');
      
      // Анализ
      if (users && users.length > 0) {
        console.log(`✅ Пользователей в БД: ${users.length}`);
        
        const ids = users.map(u => u.id);
        const uniqueIds = new Set(ids);
        
        if (uniqueIds.size === ids.length) {
          console.log(`✅ ID уникальны (${ids.join(', ')})`);
        } else {
          console.log(`❌ ВНИМАНИЕ: ID НЕ уникальны! Дублирующиеся ID:`);
          ids.forEach((id, idx) => {
            if (ids.indexOf(id) !== idx) {
              console.log(`   - ID ${id} повторяется`);
            }
          });
        }
      }
      
      if (apts && apts.length > 0) {
        console.log(`✅ Записей в БД: ${apts.length}`);
        
        // Проверка целостности foreign key
        const validApts = apts.filter(apt => users.find(u => u.id === apt.userId));
        const invalidApts = apts.filter(apt => !users.find(u => u.id === apt.userId));
        
        if (invalidApts.length === 0) {
          console.log(`✅ Все записи привязаны к существующим пользователям`);
        } else {
          console.log(`❌ ВНИМАНИЕ: ${invalidApts.length} записей привязаны к несуществующим пользователям!`);
        }
        
        // Распределение по пользователям
        console.log('');
        console.log('📊 Записи по пользователям:');
        users.forEach(user => {
          const userApts = apts.filter(a => a.userId === user.id);
          console.log(`   ${user.email}: ${userApts.length} записей`);
        });
      }
      
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('✅ Диагностика завершена\n');
      
      db.close();
      process.exit(0);
    });
  });
});
