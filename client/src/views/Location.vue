<template>
  <div class="location-page">
    <TopNav />
    
    <div class="container">
      <h1 class="page-title fade-in">Как меня найти</h1>

      <div class="location-content">
        <div class="location-info glass-card slide-in-left">
          <h2>PAHAN BARBER</h2>
          
          <div class="info-block">
            <div class="info-icon">📍</div>
            <div class="info-text">
              <h3>Адрес</h3>
              <p>Пр. Кораблестроителей, 22к2</p>
              <p class="detail">2 этаж</p>
            </div>
          </div>

          <div class="info-block">
            <div class="info-icon">🕒</div>
            <div class="info-text">
              <h3>Режим работы</h3>
              <p>9:00 - 21:00</p>
              <p class="detail">Ежедневно</p>
            </div>
          </div>

          <div class="info-block">
            <div class="info-icon">📞</div>
            <div class="info-text">
              <h3>Контакты</h3>
              <p>+7 (XXX) XXX-XX-XX</p>
              <p class="detail">Telegram / WhatsApp</p>
            </div>
          </div>

          <div class="info-block">
            <div class="info-icon">🚇</div>
            <div class="info-text">
              <h3>Как добраться</h3>
              <p>Ближайшее метро: станция...</p>
              <p class="detail">5 минут пешком от метро</p>
            </div>
          </div>

          <button class="btn-primary" @click="$router.push('/home')">
            Записаться
          </button>
        </div>

        <div class="map-container slide-in-right">
          <div class="map-placeholder glass-card">
            <div class="map-content">
              <p>Здесь будет встроена карта (Google Maps / Яндекс.Карты)</p>
              <p class="coordinates">Координаты: 59.8944, 30.4619</p>
              
              <!-- Пример встройки Яндекс.Карт -->
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=30.461900,59.894400&z=16&l=map&pt=30.461900,59.894400,pm2rdm"
                width="100%"
                height="100%"
                frameborder="0"
                style="border-radius: 12px;"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div class="landmarks-section slide-in-up">
        <h2>Ориентиры</h2>
        <div class="landmarks-grid">
          <div class="landmark-card glass-card">
            <div class="landmark-icon">🏢</div>
            <h3>Бизнес-центр</h3>
            <p>Вход со стороны проспекта, второй этаж</p>
          </div>
          <div class="landmark-card glass-card">
            <div class="landmark-icon">🅿️</div>
            <h3>Парковка</h3>
            <p>Бесплатная парковка у здания</p>
          </div>
          <div class="landmark-card glass-card">
            <div class="landmark-icon">♿</div>
            <h3>Доступность</h3>
            <p>Есть лифт и пандус</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '../components/TopNav.vue';

export default {
  name: 'Location',
  components: {
    TopNav
  }
}
</script>

<style scoped>
.location-page {
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

.location-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 40px;
  margin-bottom: 80px;
}

.location-info {
  padding: 40px;
  height: fit-content;
}

.location-info h2 {
  color: var(--accent-gold);
  font-size: 2rem;
  margin-bottom: 35px;
  letter-spacing: 3px;
  text-align: center;
}

.info-block {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--border-subtle);
}

.info-block:last-of-type {
  border-bottom: none;
  margin-bottom: 40px;
}

.info-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.info-text h3 {
  color: var(--accent-light);
  font-size: 1.2rem;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.info-text p {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.info-text .detail {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 5px;
}

.map-container {
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 600px;
  padding: 0;
  overflow: hidden;
}

.map-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  position: relative;
}

.map-content p {
  margin: 10px 0;
  text-align: center;
  padding: 0 20px;
}

.coordinates {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.map-content iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.landmarks-section {
  margin-top: 80px;
}

.landmarks-section h2 {
  text-align: center;
  color: var(--accent-gold);
  font-size: 2rem;
  margin-bottom: 40px;
  letter-spacing: 3px;
}

.landmarks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.landmark-card {
  padding: 35px 25px;
  text-align: center;
  transition: transform 0.3s ease;
}

.landmark-card:hover {
  transform: translateY(-10px);
}

.landmark-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.landmark-card h3 {
  color: var(--accent-light);
  font-size: 1.3rem;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.landmark-card p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 968px) {
  .location-content {
    grid-template-columns: 1fr;
  }

  .map-placeholder {
    height: 450px;
  }

  .landmarks-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .location-page {
    padding-top: 80px;
  }

  .page-title {
    font-size: 2rem;
  }

  .location-info {
    padding: 30px 20px;
  }

  .location-info h2 {
    font-size: 1.5rem;
  }

  .info-icon {
    font-size: 2rem;
  }

  .map-placeholder {
    height: 350px;
  }
}
</style>
