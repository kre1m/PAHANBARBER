const fs = require('fs');
const path = require('path');

console.log('\n⚠️  УДАЛЕНИЕ И ПЕРЕСОЗДАНИЕ БД\n');

const dbPath = path.join(__dirname, 'barber.db');

if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('✅ Удален старый файл barber.db');
  } catch (err) {
    console.error('❌ Ошибка при удалении БД:', err.message);
    console.log('💡 Совет: Закройте все окна с запущенным сервером перед удалением БД');
    process.exit(1);
  }
} else {
  console.log('⚠️  barber.db не найден, будет создана новая БД');
}

console.log('\n✅ БД будет пересоздана при запуске сервера');
console.log('   Все данные удалены, админ аккаунт будет переинициализирован');
console.log('\n📝 Админ аккаунт:\n   Email: admin@pahanbarber.ru\n   Password: PahanAdmin2024!\n');
