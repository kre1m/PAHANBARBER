<template>
  <div class="reviews-page">
    <TopNav />
    
    <div class="container">
      <h1 class="page-title fade-in">Отзывы</h1>

      <div v-if="loading" class="loading">Загрузка...</div>

      <div v-else-if="reviews.length === 0" class="empty-state glass-card">
        <p>Пока нет отзывов</p>
        <p class="subtitle">Станьте первым, кто оставит отзыв!</p>
      </div>

      <div v-else class="reviews-grid">
        <div 
          v-for="(review, index) in reviews" 
          :key="review.id"
          class="review-card glass-card slide-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="review-header">
            <div class="user-info">
              <div class="avatar">{{ review.avatar }}</div>
              <div class="user-details">
                <h3>{{ review.firstName }} {{ review.lastName }}</h3>
                <p class="review-date">{{ formatDate(review.createdAt) }}</p>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= review.rating ? '⭐' : '☆' }}
              </span>
            </div>
          </div>

          <p class="review-comment">{{ review.comment }}</p>
        </div>
      </div>

      <div class="stats-section slide-in-up">
        <div class="stat-card glass-card">
          <div class="stat-value">{{ averageRating }}</div>
          <div class="stat-label">Средняя оценка</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-value">{{ reviews.length }}</div>
          <div class="stat-label">Всего отзывов</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '../components/TopNav.vue';
import api from '../services/api';

export default {
  name: 'Reviews',
  components: {
    TopNav
  },
  data() {
    return {
      reviews: [],
      loading: true
    }
  },
  computed: {
    averageRating() {
      if (this.reviews.length === 0) return '0.0';
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / this.reviews.length).toFixed(1);
    }
  },
  async mounted() {
    await this.loadReviews();
  },
  methods: {
    async loadReviews() {
      try {
        const response = await api.getAllReviews();
        this.reviews = response.data;
      } catch (err) {
        console.error('Ошибка загрузки отзывов:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }
}
</script>

<style scoped>
.reviews-page {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 80px;
  background: var(--bg-dark);
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--accent-gold);
  margin-bottom: 60px;
  letter-spacing: 4px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  max-width: 600px;
  margin: 0 auto;
}

.empty-state p {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-state .subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.reviews-grid {
  display: grid;
  gap: 25px;
  max-width: 900px;
  margin: 0 auto 60px;
}

.review-card {
  padding: 30px;
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
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
  background: var(--bg-secondary);
  border: 2px solid var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
}

.user-details h3 {
  color: var(--text-primary);
  font-size: 1.3rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.review-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.review-rating {
  display: flex;
  gap: 5px;
  font-size: 1.3rem;
}

.star {
  color: var(--accent-gold);
}

.review-comment {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.8;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  max-width: 500px;
  margin: 0 auto;
}

.stat-card {
  padding: 35px;
  text-align: center;
}

.stat-value {
  font-size: 3rem;
  color: var(--accent-gold);
  font-weight: 700;
  margin-bottom: 10px;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 1.1rem;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .reviews-page {
    padding-top: 80px;
  }

  .page-title {
    font-size: 2rem;
  }

  .review-card {
    padding: 20px;
  }

  .review-header {
    flex-direction: column;
    gap: 15px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    font-size: 25px;
  }

  .user-details h3 {
    font-size: 1.1rem;
  }

  .review-rating {
    font-size: 1.1rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 2.5rem;
  }
}
</style>
