const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'barber.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения:', err.message);
    process.exit(1);
  }
  
  console.log('\n📋 ПРОВЕРКА АДМИН АККАУНТА\n');
  
  db.get('SELECT id, email, firstName, lastName, role FROM users WHERE email = ?', 
    ['admin@pahanbarber.ru'], 
    (err, admin) => {
      if (err) {
        console.error('❌ Ошибка:', err);
        db.close();
        process.exit(1);
      }
      
      if (!admin) {
        console.log('❌ АДМИН АККАУНТ НЕ НАЙДЕН!');
        console.log('\nПолучите все пользователей:');
        
        db.all('SELECT id, email, role FROM users', (err, users) => {
          if (users) {
            console.table(users);
          }
          db.close();
          process.exit(1);
        });
      } else {
        console.log('👤 АДМИН АККАУНТ:');
        console.log('─────────────────────────────────────');
        console.log(`ID: ${admin.id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Name: ${admin.firstName} ${admin.lastName}`);
        console.log(`Role: ${admin.role}`);
        console.log('─────────────────────────────────────');
        
        if (admin.role === 'admin') {
          console.log('\n✅ РОЛЬ ПРАВИЛЬНАЯ (admin)');
        } else {
          console.log(`\n❌ ОШИБКА: Role = "${admin.role}", а должно быть "admin"`);
          console.log('\n🔧 Фикс: Запустите update-admin-role.js');
        }
        
        db.close();
        process.exit(0);
      }
    }
  );
});
