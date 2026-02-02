// Создаем файл для подключения к main.js для логирования
export function initDebugLogging() {
  console.log('🔍 INIT DEBUG LOGGING');
  
  // Логируем при загрузке страницы
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  console.group('📊 CURRENT STORAGE STATE');
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('User Role:', user.role);
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  console.groupEnd();
  
  // Следим за изменениями localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      console.warn('⚠️ USER STORAGE CHANGED');
      const newUser = JSON.parse(e.newValue || '{}');
      console.log('New User ID:', newUser.id);
      console.log('New User Email:', newUser.email);
    }
    if (e.key === 'token') {
      console.warn('⚠️ TOKEN STORAGE CHANGED');
    }
  });
}

export function logStorageState(label = '') {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  console.group(`📊 STORAGE STATE: ${label}`);
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('User Role:', user.role);
  console.log('Token exists:', !!token);
  console.groupEnd();
}
