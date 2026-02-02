<template>
  <div class="dashboard">
    <h1 class="page-title">Дашборд</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <h3>Записи сегодня</h3>
          <p class="stat-value">{{ stats.today || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>Записи за неделю</h3>
          <p class="stat-value">{{ stats.thisWeek || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>Завершенные</h3>
          <p class="stat-value">{{ stats.completed || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-info">
          <h3>Ожидают</h3>
          <p class="stat-value">{{ stats.pending || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>Общая выручка</h3>
          <p class="stat-value">{{ stats.totalRevenue || 0 }} ₽</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>Всего клиентов</h3>
          <p class="stat-value">{{ stats.totalUsers || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <h3>Отзывов</h3>
          <p class="stat-value">{{ stats.totalReviews || 0 }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <h3>Средний рейтинг</h3>
          <p class="stat-value">{{ stats.avgRating || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {},
      loading: true
    }
  },
  async mounted() {
    await this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      try {
        const response = await api.adminGetStatistics();
        this.stats = response.data;
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.page-title {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.stat-card {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #d4af37;
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 15px;
}

.stat-info h3 {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin: 0 0 10px 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.stat-value {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
