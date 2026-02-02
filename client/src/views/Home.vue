<template>
  <div class="home-page">
    <!-- Верхняя навигация -->
    <nav class="top-nav fade-in">
      <div class="nav-links">
        <router-link to="/home" class="nav-pill active">Главная</router-link>
        <router-link to="/reviews" class="nav-pill">Отзывы</router-link>
        <router-link to="/location" class="nav-pill">Как меня найти</router-link>
        <router-link to="/about" class="nav-pill">Обо мне</router-link>
      </div>
      <router-link to="/profile" class="profile-btn">
        <div class="avatar-icon">{{ user?.avatar || '😊' }}</div>
      </router-link>
    </nav>

    <div class="hero-section">
      <div class="hero-background"></div>
      
      <!-- Левая боковая панель с адресом и временем -->
      <div class="left-sidebar slide-in-left">
        <div class="sidebar-item">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="sidebar-text">
            <p>Пр. Кораблестроителей, 22к2</p>
            <p>2 этаж</p>
          </div>
        </div>
        
        <div class="sidebar-item">
          <div class="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="sidebar-text">
            <p>9:00 - 21:00</p>
            <p>ежедневно</p>
          </div>
        </div>
      </div>

      <!-- Правая боковая панель с соцсетями -->
      <div class="right-sidebar slide-in-right">
        <a href="#" class="social-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
          </svg>
        </a>
        <a href="#" class="social-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </a>
      </div>
      
      <div class="container">
        <div class="hero-content fade-in">
          <h1 class="hero-title">PAHAN BARBER</h1>
          <button class="btn-booking" @click="showBookingModal = true">
            ЗАПИСАТЬСЯ
          </button>
        </div>
      </div>
    </div>

    <div class="price-section">
      <div class="container">
        <div class="price-card glass-card slide-in-up">
          <h2 class="price-title">ПРАЙС ЛИСТ</h2>
          
          <div class="price-list">
            <div v-for="(service, index) in services" :key="index" class="price-item">
              <span class="service-name">{{ service.name }}</span>
              <div class="price-line"></div>
              <span class="service-price">{{ service.price }} руб</span>
            </div>
          </div>
        </div>

        <div class="barber-info slide-in-up">
          <div class="barber-text">
            <p>Я работаю в индустрии барберинга уже 6 лет. Это моё хобби, которое переросло в профессию, которую я очень люблю и всегда развиваюсь в этой сфере.</p>
            <ul>
              <li>В 2021 году закончил курсы в школе Давида Сейрановича.</li>
              <li>Также в 2021 году получил квалификацию у топового барбера из Петербурга - Батреза Бажовака.</li>
              <li>В 2022 получил квалификацию в Ростове-на-Дону у Преподавателя крупнейшей сети Барберов топ TORGUN - Михаила Гучина.</li>
              <li>В 2024 году получил квалификацию у - Данила Зоценка, Дмитрия Ерофеева и Романа Даниева.</li>
            </ul>
            <p class="motto">Моя цель - это не просто типичные стрижки но страсть к созданию идеального образа</p>
          </div>
          <div class="barber-image">
            <div class="image-placeholder"></div>
          </div>
        </div>

        <div class="gallery-section slide-in-up">
          <div class="gallery-grid">
            <div class="gallery-item">
              <div class="gallery-placeholder"></div>
            </div>
            <div class="gallery-item">
              <div class="gallery-placeholder"></div>
            </div>
            <div class="gallery-item">
              <div class="gallery-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно записи -->
    <div v-if="showBookingModal" class="modal-overlay" @click.self="closeBookingModal">
      <div class="modal-content glass-card scale-in">
        <button class="modal-close" @click="closeBookingModal">✕</button>
        
        <h2 class="modal-title">Запись на услугу</h2>

        <div class="booking-form">
          <div class="form-group">
            <label>Ваше имя</label>
            <input type="text" :value="userInfo.name" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input type="text" :value="userInfo.phone" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Выберите услуги</label>
            <div class="services-checkboxes">
              <label 
                v-for="(service, index) in services" 
                :key="index"
                class="service-checkbox"
              >
                <input 
                  type="checkbox" 
                  :value="service"
                  v-model="selectedServices"
                />
                <span>{{ service.name }} - {{ service.price }} руб</span>
              </label>
            </div>
          </div>

          <div v-if="selectedServices.length > 0" class="total-price">
            Итого: {{ totalPrice }} руб
          </div>

          <div class="form-group">
            <label>Выберите дату</label>
            <div class="calendar">
              <div 
                v-for="date in availableDates" 
                :key="date.dateStr"
                class="calendar-date"
                :class="{ 
                  selected: selectedDate === date.dateStr,
                  disabled: date.fullyBooked
                }"
                @click="!date.fullyBooked && selectDate(date.dateStr)"
              >
                <div class="date-day">{{ date.day }}</div>
                <div class="date-month">{{ date.month }}</div>
              </div>
            </div>
          </div>

          <div v-if="selectedDate" class="form-group">
            <label>Выберите время</label>
            <div class="time-slots">
              <div 
                v-for="time in availableTimes" 
                :key="time"
                class="time-slot"
                :class="{ selected: selectedTime === time }"
                @click="selectedTime = time"
              >
                {{ time }}
              </div>
            </div>
          </div>

          <div v-if="bookingError" class="error-message">{{ bookingError }}</div>
          <div v-if="bookingSuccess" class="success-message">{{ bookingSuccess }}</div>

          <button 
            class="btn-primary"
            :disabled="!canBook || bookingLoading"
            @click="createBooking"
          >
            {{ bookingLoading ? 'Записываем...' : 'Записаться' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Home',
  data() {
    return {
      user: null,
      services: [
        { name: 'Мужская стрижка', price: 1000 },
        { name: 'Оформление бороды и усов', price: 800 },
        { name: 'Комплекс (стрижка + борода)', price: 1300 },
        { name: 'Детская стрижка (до 6 лет)', price: 900 },
        { name: 'Комбо (отец + сын)', price: 1800 },
        { name: 'Восковая депиляция лица', price: 200 }
      ],
      showBookingModal: false,
      userInfo: {
        name: '',
        phone: ''
      },
      selectedServices: [],
      selectedDate: null,
      selectedTime: null,
      availableSlots: [],
      bookingLoading: false,
      bookingError: '',
      bookingSuccess: ''
    }
  },
  computed: {
    totalPrice() {
      return this.selectedServices.reduce((sum, service) => sum + service.price, 0);
    },
    availableDates() {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const slotsForDate = this.availableSlots.filter(slot => slot.date === dateStr);
        const fullyBooked = slotsForDate.length === 0;
        
        dates.push({
          dateStr,
          day: date.getDate(),
          month: date.toLocaleDateString('ru-RU', { month: 'short' }),
          fullyBooked
        });
      }
      
      return dates;
    },
    availableTimes() {
      if (!this.selectedDate) return [];
      
      return this.availableSlots
        .filter(slot => slot.date === this.selectedDate)
        .map(slot => slot.time)
        .sort();
    },
    canBook() {
      return this.selectedServices.length > 0 && 
             this.selectedDate && 
             this.selectedTime;
    }
  },
  async mounted() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.userInfo.name = `${this.user.firstName} ${this.user.lastName}`;
      this.userInfo.phone = this.user.phone;
    }
    
    await this.loadAvailableSlots();
  },
  methods: {
    async loadAvailableSlots() {
      try {
        const response = await api.getAvailableSlots();
        this.availableSlots = response.data;
      } catch (err) {
        console.error('Ошибка загрузки доступных слотов:', err);
      }
    },
    selectDate(dateStr) {
      this.selectedDate = dateStr;
      this.selectedTime = null;
    },
    closeBookingModal() {
      this.showBookingModal = false;
      this.selectedServices = [];
      this.selectedDate = null;
      this.selectedTime = null;
      this.bookingError = '';
      this.bookingSuccess = '';
    },
    async createBooking() {
      this.bookingLoading = true;
      this.bookingError = '';
      this.bookingSuccess = '';

      try {
        await api.createAppointment({
          services: this.selectedServices.map(s => s.name),
          date: this.selectedDate,
          time: this.selectedTime,
          totalPrice: this.totalPrice
        });

        this.bookingSuccess = 'Запись успешно создана!';
        await this.loadAvailableSlots();
        
        setTimeout(() => {
          this.closeBookingModal();
        }, 2000);
      } catch (err) {
        this.bookingError = err.response?.data?.error || 'Ошибка создания записи';
      } finally {
        this.bookingLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #000000;
}

/* Верхняя навигация */
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

.nav-pill:hover,
.nav-pill.active {
  background: rgba(50, 50, 50, 0.8);
  color: #ffffff;
}

.profile-btn {
  position: absolute;
  right: 40px;
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

/* Hero секция */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 100px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.9) 100%),
    url('/images/hero-bg.jpg') center/cover no-repeat;
  z-index: -1;
}

/* Левая боковая панель */
.left-sidebar {
  position: fixed;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}

.sidebar-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar-text p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.4;
  margin: 0;
}

/* Правая боковая панель */
.right-sidebar {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.social-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon:hover {
  border-color: #d4af37;
  color: #d4af37;
  transform: scale(1.1);
}

/* Hero контент */
.hero-content {
  text-align: center;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: 5rem;
  color: #ffffff;
  margin-bottom: 50px;
  letter-spacing: 12px;
  font-weight: 400;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.8);
}

.btn-booking {
  background: transparent;
  color: #ffffff;
  border: 2px solid #d4af37;
  padding: 18px 70px;
  font-size: 20px;
  letter-spacing: 4px;
  text-transform: uppercase;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-family: 'Cormorant Garamond', serif;
  position: relative;
  overflow: hidden;
}

.btn-booking::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #d4af37;
  transition: left 0.4s ease;
  z-index: -1;
}

.btn-booking:hover {
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
}

.btn-booking:hover::before {
  left: 0;
}

/* Секция с прайсом */
.price-section {
  padding: 80px 0 100px;
  background: #000000;
}

.price-card {
  max-width: 900px;
  margin: 0 auto 80px;
  padding: 50px 60px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.price-card::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10%;
  bottom: 10%;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-20deg);
}

.price-title {
  text-align: center;
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 50px;
  letter-spacing: 8px;
  font-weight: 400;
}

.price-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.price-item:last-child {
  border-bottom: none;
}

.service-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.price-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 0 20px;
}

.service-price {
  color: #ffffff;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
}

/* Информация о барбере */
.barber-info {
  max-width: 1100px;
  margin: 0 auto 80px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 60px;
  align-items: start;
}

.barber-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.8;
}

.barber-text p {
  margin-bottom: 20px;
}

.barber-text ul {
  list-style: none;
  margin: 30px 0;
  padding: 0;
}

.barber-text li {
  margin-bottom: 15px;
  padding-left: 20px;
  position: relative;
}

.barber-text li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.5);
}

.motto {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.barber-image {
  position: sticky;
  top: 100px;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Галерея */
.gallery-section {
  max-width: 1100px;
  margin: 0 auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 10px;
}

.gallery-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-placeholder {
  transform: scale(1.05);
}

/* Модальное окно */
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
  overflow-y: auto;
}

.modal-content {
  width: 100%;
  max-width: 700px;
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.1);
}

.modal-title {
  text-align: center;
  color: var(--accent-gold);
  margin-bottom: 30px;
  font-size: 2rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group label {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 10px;
  font-size: 1rem;
  letter-spacing: 1px;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.services-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.service-checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
}

.service-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.total-price {
  text-align: center;
  font-size: 1.5rem;
  color: var(--accent-gold);
  font-weight: 600;
  padding: 15px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
}

.calendar-date {
  padding: 15px 10px;
  text-align: center;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.calendar-date:hover:not(.disabled) {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.1);
}

.calendar-date.selected {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.2);
}

.calendar-date.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.date-day {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
}

.date-month {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 5px;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}

.time-slot {
  padding: 12px;
  text-align: center;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.time-slot:hover {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.1);
}

.time-slot.selected {
  border-color: var(--accent-gold);
  background: rgba(212, 175, 55, 0.2);
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

@media (max-width: 1024px) {
  .left-sidebar,
  .right-sidebar {
    display: none;
  }

  .barber-info {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .barber-image {
    position: static;
  }
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

  .hero-title {
    font-size: 2.5rem;
    letter-spacing: 6px;
  }

  .btn-booking {
    padding: 15px 50px;
    font-size: 16px;
    letter-spacing: 2px;
  }

  .price-card {
    padding: 35px 25px;
    margin-bottom: 50px;
  }

  .price-title {
    font-size: 2rem;
    letter-spacing: 4px;
    margin-bottom: 35px;
  }

  .service-name,
  .service-price {
    font-size: 16px;
  }

  .barber-text {
    font-size: 14px;
  }

  .image-placeholder {
    height: 300px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .modal-content {
    padding: 30px 20px;
  }

  .calendar {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .time-slots {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
    letter-spacing: 4px;
  }

  .price-list {
    gap: 20px;
  }

  .price-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .price-line {
    display: none;
  }
}
</style>
