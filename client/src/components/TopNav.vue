<template>
  <nav class="top-nav fade-in">
    <div class="nav-links">
      <router-link to="/home" class="nav-pill">Главная</router-link>
      <router-link to="/reviews" class="nav-pill">Отзывы</router-link>
      <router-link to="/location" class="nav-pill">Как меня найти</router-link>
      <router-link to="/about" class="nav-pill">Обо мне</router-link>
    </div>
    <div class="nav-actions">
      <NotificationsDropdown v-if="user" />
      <router-link to="/profile" class="profile-btn">
        <div class="avatar-icon">{{ user?.avatar || '😊' }}</div>
      </router-link>
    </div>
  </nav>
</template>

<script>
import NotificationsDropdown from './NotificationsDropdown.vue';

export default {
  name: 'TopNav',
  components: {
    NotificationsDropdown
  },
  data() {
    return {
      user: null
    }
  },
  mounted() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }
}
</script>

<style scoped>
.top-nav {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
}

.nav-links {
  display: flex;
  gap: 15px;
  background: rgba(20, 20, 20, 0.9);
  padding: 8px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.nav-pill {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  font-family: 'Cormorant Garamond', serif;
}

.nav-pill:hover {
  background: rgba(50, 50, 50, 0.8);
  color: #ffffff;
}

.nav-pill.router-link-active {
  background: rgba(50, 50, 50, 0.8);
  color: #ffffff;
}

.nav-actions {
  position: absolute;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-btn {
  text-decoration: none;
}

.avatar-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.avatar-icon:hover {
  border-color: #d4af37;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 20px;
    top: 15px;
  }

  .nav-links {
    gap: 8px;
    padding: 6px;
  }

  .nav-pill {
    padding: 10px 18px;
    font-size: 14px;
  }

  .profile-btn {
    right: 20px;
  }

  .avatar-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    max-width: 280px;
  }

  .nav-pill {
    padding: 8px 16px;
    font-size: 13px;
  }

  .nav-actions {
    right: 20px;
    gap: 10px;
  }
}
</style>
