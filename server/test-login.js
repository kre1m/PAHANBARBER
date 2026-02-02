const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testLogin() {
  console.log('🧪 ТЕСТ ЛОГИНА С РАЗНЫМИ АККАУНТАМИ\n');
  
  try {
    //登録 два теста пользователя
    const testAccounts = [
      { 
        firstName: 'Test',
        lastName: 'User1',
        phone: '+71234567891',
        email: 'testuser1@test.com',
        password: 'TestPass123!',
        avatar: '👤'
      },
      {
        firstName: 'Test',
        lastName: 'User2', 
        phone: '+71234567892',
        email: 'testuser2@test.com',
        password: 'TestPass123!',
        avatar: '👥'
      }
    ];
    
    const results = [];
    
    for (const account of testAccounts) {
      console.log(`\n📝 Регистрация: ${account.email}`);
      
      try {
        const regRes = await axios.post(`${BASE_URL}/register`, account);
        console.log(`✅ ID: ${regRes.data.user.id}`);
        results.push({
          email: account.email,
          registeredId: regRes.data.user.id,
          registeredToken: regRes.data.token.substring(0, 20) + '...'
        });
      } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.error?.includes('зарегистрирован')) {
          console.log(`⚠️  Уже зарегистрирован, пытаемся войти`);
        } else {
          console.log(`❌ Ошибка регистрации: ${err.response?.data?.error || err.message}`);
        }
      }
    }
    
    console.log('\n\n🔐 ЛОГИН С РАЗНЫМИ АККАУНТАМИ');
    
    for (const account of testAccounts) {
      console.log(`\n🔑 Логин: ${account.email}`);
      
      try {
        const loginRes = await axios.post(`${BASE_URL}/login`, {
          email: account.email,
          password: account.password
        });
        
        console.log(`✅ User ID при логине: ${loginRes.data.user.id}`);
        console.log(`✅ Role: ${loginRes.data.user.role}`);
        console.log(`✅ Token: ${loginRes.data.token.substring(0, 20)}...`);
        
        const result = results.find(r => r.email === account.email);
        if (result) {
          result.loginId = loginRes.data.user.id;
          result.loginToken = loginRes.data.token.substring(0, 20) + '...';
          result.role = loginRes.data.user.role;
          
          if (result.registeredId !== result.loginId) {
            console.log(`⚠️  ВНИМАНИЕ! ID при регистрации (${result.registeredId}) !== ID при логине (${result.loginId})`);
          }
        }
      } catch (err) {
        console.log(`❌ Ошибка логина: ${err.response?.data?.error || err.message}`);
      }
    }
    
    console.log('\n\n📊 ИТОГОВАЯ ТАБЛИЦА');
    console.table(results);
    
    // Проверка что ID разные
    const ids = results.map(r => r.loginId).filter(Boolean);
    if (new Set(ids).size === ids.length && ids.length > 1) {
      console.log('\n✅ ХОРОШО: Все ID РАЗНЫЕ');
    } else if (ids.length > 1) {
      console.log('\n❌ ОШИБКА: ID ОДИНАКОВЫЕ!');
    }
    
  } catch (err) {
    console.error('❌ Критическая ошибка:', err.message);
  }
  
  process.exit(0);
}

testLogin();
