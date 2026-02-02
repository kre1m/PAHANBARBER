<template>
  <div class="profile-page">
    <TopNav />
    
    <div class="container">
      <div class="profile-container">
        <h1 class="page-title fade-in">Мой профиль</h1>

        <div class="profile-grid">
          <!-- Информация о пользователе -->
          <div class="profile-card glass-card slide-in-left">
            <div class="avatar-section">
              <div class="avatar-large">{{ user.avatar }}</div>
              <button class="btn-edit" @click="showEditModal = true">
                Изменить аватар
              </button>
            </div>

            <div class="user-info">
              <div class="info-item">
                <label>Имя</label>
                <p>{{ user.firstName }}</p>
              </div>
              <div class="info-item">
                <label>Фамилия</label>
                <p>{{ user.lastName }}</p>
              </div>
              <div class="info-item">
                <label>Телефон</label>
                <p>{{ user.phone }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ user.email }}</p>
              </div>
            </div>

            <button class="btn-primary" @click="showEditModal = true">
              Редактировать профиль
            </button>
          </div>

          <!-- Мои записи -->
          <div class="appointments-card glass-card slide-in-right">
            <h2>Мои записи</h2>
            
            <div v-if="appointmentsLoading" class="loading">Загрузка...</div>
            
            <div v-else-if="appointments.length === 0" class="empty-state">
              <p>У вас пока нет записей</p>
            </div>

            <div v-else class="appointments-list">
              <!-- Активные записи -->
              <div v-if="activeAppointments.length > 0">
                <h3 class="section-subtitle">Предстоящие</h3>
                <div 
                  v-for="appointment in activeAppointments" 
                  :key="appointment.id"
                  class="appointment-item"
                >
                  <div class="appointment-header">
                    <div class="appointment-date">
                      📅 {{ formatDate(appointment.date) }}
                    </div>
                    <div class="appointment-time">
                      🕒 {{ appointment.time }}
                    </div>
                  </div>
                  
                  <div class="appointment-services">
                    <strong>Услуги:</strong>
                    <ul>
                      <li v-for="(service, idx) in appointment.services" :key="idx">
                        {{ service }}
                      </li>
                    </ul>
                  </div>

                  <div class="appointment-footer">
                    <div class="appointment-price">{{ appointment.totalPrice }} руб</div>
                    <button 
                      class="btn-cancel"
                      @click="cancelAppointment(appointment.id)"
                    >
                      Отменить
                    </button>
                  </div>
                </div>
              </div>

              <!-- Завершенные записи -->
              <div v-if="completedAppointments.length > 0" style="margin-top: 30px;">
                <h3 class="section-subtitle">Завершенные</h3>
                <div 
                  v-for="appointment in completedAppointments" 
                  :key="appointment.id"
                  class="appointment-item completed"
                >
                  <div class="appointment-header">
                    <div class="appointment-date">
                      ✅ {{ formatDate(appointment.date) }}
                    </div>
                    <div class="appointment-time">
                      🕒 {{ appointment.time }}
                    </div>
                  </div>
                  
                  <div class="appointment-services">
                    <strong>Услуги:</strong>
                    <ul>
                      <li v-for="(service, idx) in appointment.services" :key="idx">
                        {{ service }}
                      </li>
                    </ul>
                  </div>

                  <div class="appointment-footer">
                    <div class="appointment-price">{{ appointment.totalPrice }} руб</div>
                    <button 
                      v-if="!appointment.reviewId"
                      class="btn-review"
                      @click="openReviewModal(appointment)"
                    >
                      Оставить отзыв
                    </button>
                    <span v-else class="review-badge">Отзыв оставлен ⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content glass-card scale-in">
        <button class="modal-close" @click="showEditModal = false">✕</button>
        
        <h2 class="modal-title">Редактировать профиль</h2>

        <form @submit.prevent="updateProfile" class="edit-form">
          <div class="form-group">
            <label>Имя</label>
            <input v-model="editForm.firstName" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Фамилия</label>
            <input v-model="editForm.lastName" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input v-model="editForm.phone" type="tel" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Выберите аватар</label>
            <div class="emoji-picker">
              <div 
                v-for="emoji in emojis" 
                :key="emoji"
                class="emoji-option"
                :class="{ selected: editForm.avatar === emoji }"
                @click="editForm.avatar = emoji"
              >
                {{ emoji }}
              </div>
            </div>
          </div>

          <div v-if="editError" class="error-message">{{ editError }}</div>
          <div v-if="editSuccess" class="success-message">{{ editSuccess }}</div>

          <button type="submit" class="btn-primary" :disabled="editLoading">
            {{ editLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Модальное окно отзыва -->
    <div v-if="showReviewModal" class="modal-overlay" @click.self="closeReviewModal">
      <div class="modal-content glass-card scale-in">
        <button class="modal-close" @click="closeReviewModal">✕</button>
        
        <h2 class="modal-title">{{ editingReview ? 'Редактировать отзыв' : 'Оставить отзыв' }}</h2>

        <form @submit.prevent="submitReview" class="review-form">
          <div class="form-group">
            <label>Оценка</label>
            <div class="star-rating">
              <span 
                v-for="i in 5" 
                :key="i"
                class="star"
                :class="{ active: i <= reviewForm.rating }"
                @click="reviewForm.rating = i"
              >
                ⭐
              </span>
            </div>
          </div>

          <div class="form-group">
            <label>Комментарий</label>
            <textarea 
              v-model="reviewForm.comment" 
              class="form-textarea"
              rows="5"
              placeholder="Поделитесь впечатлениями о работе мастера..."
            ></textarea>
          </div>

          <div v-if="reviewError" class="error-message">{{ reviewError }}</div>
          <div v-if="reviewSuccess" class="success-message">{{ reviewSuccess }}</div>

          <button 
            type="submit" 
            class="btn-primary" 
            :disabled="!reviewForm.rating || reviewLoading"
          >
            {{ reviewLoading ? 'Отправка...' : (editingReview ? 'Обновить отзыв' : 'Отправить отзыв') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import TopNav from '../components/TopNav.vue';
import api from '../services/api';

export default {
  name: 'Profile',
  components: {
    TopNav
  },
  data() {
    return {
      user: {},
      appointments: [],
      appointmentsLoading: true,
      showEditModal: false,
      showReviewModal: false,
      editingReview: null,
      selectedAppointment: null,
      editForm: {
        firstName: '',
        lastName: '',
        phone: '',
        avatar: '😊'
      },
      reviewForm: {
        rating: 0,
        comment: ''
      },
      emojis: ['😊', '😎', '🤠', '👨', '👨‍🦱', '👨‍🦰', '👨‍🦳', '🧔', '👔', '💼', '⚡', '🔥', '✨', '🎯', '🏆', '👑'],
      editLoading: false,
      editError: '',
      editSuccess: '',
      reviewLoading: false,
      reviewError: '',
      reviewSuccess: ''
    }
  },
  computed: {
    activeAppointments() {
      return this.appointments.filter(apt => apt.status === 'pending');
    },
    completedAppointments() {
      return this.appointments.filter(apt => apt.status === 'completed');
    }
  },
  async mounted() {
    await this.loadUserData();
    await this.loadAppointments();
  },
  methods: {
    async loadUserData() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.editForm = { ...this.user };
      }
    },
    async loadAppointments() {
      try {
        const response = await api.getAppointments();
        this.appointments = response.data;
      } catch (err) {
        console.error('Ошибка загрузки записей:', err);
      } finally {
        this.appointmentsLoading = false;
      }
    },
    openReviewModal(appointment) {
      this.selectedAppointment = appointment;
      this.reviewForm = {
        rating: 0,
        comment: ''
      };
      this.editingReview = null;
      this.reviewError = '';
      this.reviewSuccess = '';
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.showReviewModal = false;
      this.selectedAppointment = null;
      this.reviewForm = { rating: 0, comment: '' };
      this.editingReview = null;
    },
    async submitReview() {
      this.reviewLoading = true;
      this.reviewError = '';
      this.reviewSuccess = '';

      try {
        const reviewData = {
          appointmentId: this.selectedAppointment.id,
          rating: this.reviewForm.rating,
          comment: this.reviewForm.comment
        };

        if (this.editingReview) {
          await api.updateReview(this.editingReview.id, {
            rating: this.reviewForm.rating,
            comment: this.reviewForm.comment
          });
          this.reviewSuccess = 'Отзыв обновлен!';
        } else {
          await api.createReview(reviewData);
          this.reviewSuccess = 'Спасибо за ваш отзыв!';
        }
        
        await this.loadAppointments();
        
        setTimeout(() => {
          this.closeReviewModal();
        }, 1500);
      } catch (err) {
        this.reviewError = err.response?.data?.error || 'Ошибка отправки отзыва';
      } finally {
        this.reviewLoading = false;
      }
    },
    async updateProfile() {
      this.editLoading = true;
      this.editError = '';
      this.editSuccess = '';

      try {
        await api.updateProfile(this.editForm);
        this.user = { ...this.user, ...this.editForm };
        localStorage.setItem('user', JSON.stringify(this.user));
        
        this.editSuccess = 'Профиль успешно обновлен!';
        
        setTimeout(() => {
          this.showEditModal = false;
          this.editSuccess = '';
        }, 2000);
      } catch (err) {
        this.editError = err.response?.data?.error || 'Ошибка обновления профиля';
      } finally {
        this.editLoading = false;
      }
    },
    async cancelAppointment(id) {
      if (!confirm('Вы уверены, что хотите отменить запись?')) return;

      try {
        await api.cancelAppointment(id);
        await this.loadAppointments();
      } catch (err) {
        alert('Ошибка отмены записи');
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
.profile-page {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 80px;
  background: var(--bg-dark);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--accent-gold);
  margin-bottom: 50px;
  letter-spacing: 4px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

.profile-card, .appointments-card {
  padding: 35px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 3px solid var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  margin: 0 auto 20px;
}

.btn-edit {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.info-item label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.info-item p {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.appointments-card h2,
.reviews-section h2 {
  color: var(--accent-gold);
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-subtitle {
  color: var(--accent-gold);
  font-size: 1.2rem;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.appointment-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.appointment-item.completed {
  opacity: 0.85;
  border-color: rgba(81, 207, 102, 0.2);
}

.appointment-item:hover {
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.05);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: var(--text-primary);
  font-size: 1rem;
}

.appointment-services {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.appointment-services ul {
  list-style: none;
  margin-top: 8px;
}

.appointment-services li {
  padding: 5px 0;
  padding-left: 20px;
  position: relative;
}

.appointment-services li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-gold);
}

.appointment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.appointment-price {
  font-size: 1.3rem;
  color: var(--accent-gold);
  font-weight: 600;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #ff6b6b;
  color: white;
}

.btn-review {
  background: transparent;
  border: 1px solid #51cf66;
  color: #51cf66;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-review:hover {
  background: #51cf66;
  color: white;
}

.review-badge {
  color: #51cf66;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reviews-section {
  margin-top: 50px;
}

.reviews-section .btn-primary {
  margin-bottom: 30px;
}

.reviews-list {
  display: grid;
  gap: 20px;
}

.review-item {
  padding: 25px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.review-rating {
  font-size: 1.2rem;
}

.review-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.review-comment {
  color: var(--text-primary);
  line-height: 1.6;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: var(--accent-gold);
}

.modal-title {
  text-align: center;
  color: var(--accent-gold);
  margin-bottom: 30px;
  font-size: 2rem;
}

.edit-form, .review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: 1rem;
  letter-spacing: 1px;
}

.form-input, .form-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
}

.form-textarea {
  resize: vertical;
  font-family: 'Cormorant Garamond', serif;
}

.emoji-picker {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.emoji-option {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid var(--border-subtle);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.emoji-option:hover {
  border-color: var(--accent-gold);
  transform: scale(1.1);
}

.emoji-option.selected {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.1);
}

.star-rating {
  display: flex;
  gap: 10px;
  font-size: 2rem;
}

.star {
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.3;
}

.star.active {
  opacity: 1;
}

.star:hover {
  transform: scale(1.2);
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  padding: 12px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

.success-message {
  color: #51cf66;
  text-align: center;
  padding: 12px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 8px;
}

@media (max-width: 968px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding-top: 80px;
  }

  .page-title {
    font-size: 2rem;
  }

  .profile-card, .appointments-card {
    padding: 25px;
  }

  .emoji-picker {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
