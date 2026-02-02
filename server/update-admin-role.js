const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'barber.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения:', err.message);
    process.exit(1);
  }
  
  console.log('\n🔧 ОБНОВЛЕНИЕ РОЛИ АДМИНА\n');
  
  db.run('UPDATE users SET role = ? WHERE email = ?', 
    ['admin', 'admin@pahanbarber.ru'],
    function(err) {
      if (err) {
        console.error('❌ Ошибка при обновлении:', err);
        db.close();
        process.exit(1);
      }
      
      console.log(`✅ Обновлено записей: ${this.changes}`);
      
      // Проверяем результат
      db.get('SELECT id, email, role FROM users WHERE email = ?', 
        ['admin@pahanbarber.ru'], 
        (err, admin) => {
          if (err) {
            console.error('❌ Ошибка при проверке:', err);
            db.close();
            process.exit(1);
          }
          
          if (admin) {
            console.log('\n✅ РЕЗУЛЬТАТ:');
            console.log(`Email: ${admin.email}`);
            console.log(`Role: ${admin.role}`);
            console.log('\n✅ Админ аккаунт готов!');
            console.log('Пожалуйста, перезагрузите браузер и попробуйте еще раз');
          }
          
          db.close();
          process.exit(0);
        }
      );
    }
  );
});
