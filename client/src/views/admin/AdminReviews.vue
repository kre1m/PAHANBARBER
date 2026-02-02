<template>
  <div class="admin-reviews">
    <h1 class="page-title">Модерация отзывов</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="reviews.length === 0" class="empty-state">
      <p>Отзывов пока нет</p>
    </div>

    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="review-card glass-card">
        <div class="review-header">
          <div class="user-info">
            <div class="avatar">{{ review.avatar }}</div>
            <div>
              <h3>{{ review.firstName }} {{ review.lastName }}</h3>
              <p class="review-meta">{{ review.phone }}</p>
              <p class="review-meta">{{ formatDate(review.date) }} в {{ review.time }}</p>
            </div>
          </div>
          <div class="review-rating">
            <span v-for="i in 5" :key="i">
              {{ i <= review.rating ? '⭐' : '☆' }}
            </span>
          </div>
        </div>

        <p class="review-comment">{{ review.comment || 'Без комментария' }}</p>

        <div class="review-footer">
          <span class="review-date">{{ formatDateTime(review.createdAt) }}</span>
          <button class="btn-delete" @click="deleteReview(review.id)">
            🗑️ Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AdminReviews',
  data() {
    return {
      reviews: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadReviews();
  },
  methods: {
    async loadReviews() {
      try {
        const response = await api.adminGetReviews();
        this.reviews = response.data;
      } catch (err) {
        console.error('Ошибка загрузки отзывов:', err);
      } finally {
        this.loading = false;
      }
    },
    async deleteReview(id) {
      if (!confirm('Удалить этот отзыв? Это действие нельзя отменить.')) return;

      try {
        await api.adminDeleteReview(id);
        this.reviews = this.reviews.filter(r => r.id !== id);
      } catch (err) {
        alert('Ошибка удаления отзыва');
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU');
    },
    formatDateTime(dateStr) {
      return new Date(dateStr).toLocaleString('ru-RU');
    }
  }
}
</script>

<style scoped>
.admin-reviews {
  max-width: 1400px;
}

.page-title {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.5);
}

.reviews-grid {
  display: grid;
  gap: 25px;
}

.review-card {
  padding: 25px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
}

.user-info h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0 0 5px 0;
}

.review-meta {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 2px 0;
}

.review-rating {
  font-size: 1.3rem;
}

.review-comment {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.review-date {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

.btn-delete {
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-delete:hover {
  background: #ff6b6b;
  color: white;
}
</style>
