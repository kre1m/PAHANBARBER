<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand" @click="$router.push('/home')">
        <h1>PAHAN BARBER</h1>
      </div>
      
      <div class="navbar-menu" :class="{ active: menuOpen }">
        <router-link to="/home" class="nav-link" @click="closeMenu">Главная</router-link>
        <router-link to="/reviews" class="nav-link" @click="closeMenu">Отзывы</router-link>
        <router-link to="/location" class="nav-link" @click="closeMenu">Как меня найти</router-link>
        <router-link to="/about" class="nav-link" @click="closeMenu">Обо мне</router-link>
      </div>

      <div class="navbar-actions">
        <router-link to="/profile" class="profile-icon">
          <div class="avatar">{{ user?.avatar || '😊' }}</div>
        </router-link>
        <button class="logout-btn" @click="handleLogout" title="Выйти">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      <button class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      menuOpen: false,
      user: null
    }
  },
  mounted() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    handleLogout() {
      console.log('🚪 Выход из аккаунта');
      localStorage.clear();
      sessionStorage.clear();
      // Очищаем кэш браузера для этого домена
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-subtle);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-2px);
}

.navbar-brand h1 {
  font-size: 1.8rem;
  letter-spacing: 4px;
  color: var(--accent-gold);
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.1rem;
  letter-spacing: 1px;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-gold);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--accent-gold);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--accent-gold);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-icon {
  text-decoration: none;
  transition: transform 0.3s ease;
}

.profile-icon:hover {
  transform: scale(1.1);
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: var(--accent-light);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  transform: scale(1.1);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 2px;
  background: var(--accent-gold);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 15px 20px;
  }

  .navbar-brand h1 {
    font-size: 1.3rem;
    letter-spacing: 2px;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.98);
    flex-direction: column;
    padding: 30px;
    gap: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-bottom: 1px solid var(--border-subtle);
  }

  .navbar-menu.active {
    transform: translateX(0);
  }

  .menu-toggle {
    display: flex;
  }

  .navbar-actions {
    gap: 15px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
