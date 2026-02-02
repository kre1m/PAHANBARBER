<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <div class="admin-logo">
        <h2>👑 АДМИН</h2>
      </div>
      
      <nav class="admin-nav">
        <router-link to="/admin" exact class="admin-nav-item">
          <span class="icon">📊</span>
          Дашборд
        </router-link>
        <router-link to="/admin/appointments" class="admin-nav-item">
          <span class="icon">📅</span>
          Записи
        </router-link>
        <router-link to="/admin/reviews" class="admin-nav-item">
          <span class="icon">💬</span>
          Отзывы
        </router-link>
        <router-link to="/admin/schedule" class="admin-nav-item">
          <span class="icon">⏰</span>
          Расписание
        </router-link>
        <router-link to="/admin/clients" class="admin-nav-item">
          <span class="icon">👥</span>
          Клиенты
        </router-link>
      </nav>

      <button class="btn-logout" @click="logout">
        <span class="icon">🚪</span>
        Выход
      </button>
    </div>

    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  methods: {
    logout() {
      console.log('🚪 Выход админа из аккаунта');
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
  background: #000000;
}

.admin-sidebar {
  width: 280px;
  background: rgba(20, 20, 20, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.admin-logo {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-logo h2 {
  color: #d4af37;
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
  letter-spacing: 2px;
}

.admin-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.admin-nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.admin-nav-item.router-link-active {
  background: rgba(212, 175, 55, 0.1);
  border-left-color: #d4af37;
  color: #d4af37;
}

.admin-nav-item .icon {
  font-size: 1.3rem;
}

.btn-logout {
  margin: 20px;
  padding: 15px;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-logout:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: #ff6b6b;
}

.admin-content {
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  overflow-y: auto;
}

@media (max-width: 968px) {
  .admin-sidebar {
    width: 80px;
  }

  .admin-logo h2 {
    font-size: 1.2rem;
  }

  .admin-nav-item span:not(.icon) {
    display: none;
  }

  .admin-content {
    margin-left: 80px;
    padding: 20px;
  }

  .btn-logout span:not(.icon) {
    display: none;
  }
}
</style>
