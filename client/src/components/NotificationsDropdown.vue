<template>
  <div class="notifications-wrapper">
    <button class="notifications-btn" @click.stop="toggleNotifications">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Полупрозрачный фон при открытом dropdown -->
    <div v-if="isOpen" class="notifications-overlay" @click="closeNotifications"></div>

    <div v-if="isOpen" class="notifications-dropdown" @click.stop="() => {}" v-click-outside="closeNotifications">
      <div class="notifications-header">
        <h3>Уведомления</h3>
        <button v-if="unreadCount > 0" @click="markAllRead" class="mark-all-btn">
          Прочитать все
        </button>
      </div>

      <div v-if="loading" class="notifications-loading">
        Загрузка...
      </div>

      <div v-else-if="notifications.length === 0" class="notifications-empty">
        <p>Нет уведомлений</p>
      </div>

      <div v-else class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="notification.type">
            <span v-if="notification.type === 'appointment_created'">📅</span>
            <span v-else-if="notification.type === 'appointment_cancelled'">❌</span>
            <span v-else-if="notification.type === 'review_request'">⭐</span>
            <span v-else>🔔</span>
          </div>
          <div class="notification-content">
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'NotificationsDropdown',
  data() {
    return {
      isOpen: false,
      notifications: [],
      loading: false
    }
  },
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    }
  },
  mounted() {
    this.loadNotifications();
    // Обновляем уведомления каждые 30 секунд
    this.interval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    async loadNotifications() {
      try {
        this.loading = true;
        const response = await api.getNotifications();
        this.notifications = response.data;
        console.log('📬 Уведомления загружены:', this.notifications.length);
      } catch (err) {
        console.error('❌ Ошибка загрузки уведомлений:', err);
      } finally {
        this.loading = false;
      }
    },
    toggleNotifications() {
      console.log('🔔 Клик по кнопке уведомлений, было открыто:', this.isOpen);
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.loadNotifications();
      }
    },
    closeNotifications() {
      console.log('🔔 Закрыватие уведомлений');
      this.isOpen = false;
    },
    async markAsRead(id) {
      try {
        await api.markNotificationRead(id);
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.read = 1;
        }
      } catch (err) {
        console.error('Ошибка отметки уведомления:', err);
      }
    },
    async markAllRead() {
      try {
        await api.markAllNotificationsRead();
        this.notifications.forEach(n => n.read = 1);
      } catch (err) {
        console.error('Ошибка отметки всех уведомлений:', err);
      }
    },
    formatTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now - date;
      
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      
      if (minutes < 1) return 'только что';
      if (minutes < 60) return `${minutes} мин назад`;
      if (hours < 24) return `${hours} ч назад`;
      if (days < 7) return `${days} дн назад`;
      
      return date.toLocaleDateString('ru-RU');
    }
  },
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  }
}
</script>

<style scoped>
.notifications-wrapper {
  position: relative;
  z-index: 2001;
}

.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2999;
  background: transparent;
}

.notifications-btn {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 2001;
}

.notifications-btn:hover {
  border-color: #d4af37;
  color: #d4af37;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.notifications-dropdown {
  position: fixed !important;
  top: 80px !important;
  right: 40px !important;
  width: 380px;
  max-height: 500px;
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 9999 !important;
  animation: slideDown 0.3s ease;
  visibility: visible !important;
  opacity: 1 !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notifications-header h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
}

.mark-all-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mark-all-btn:hover {
  border-color: #d4af37;
  color: #d4af37;
}

.notifications-loading,
.notifications-empty {
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.notifications-list {
  max-height: 420px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.3s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(212, 175, 55, 0.05);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
}

.notification-content {
  flex: 1;
}

.notification-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .notifications-dropdown {
    width: 320px;
    right: 20px;
    top: 80px;
  }

  .notifications-btn {
    width: 45px;
    height: 45px;
  }
}
</style>
