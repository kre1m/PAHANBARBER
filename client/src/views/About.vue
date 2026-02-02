<template>
  <div class="about-page">
    <TopNav />
    
    <div class="container">
      <div class="about-content">
        <h1 class="page-title fade-in">Обо мне</h1>

        <div class="about-grid">
          <div class="about-image slide-in-left">
            <div class="image-placeholder"></div>
          </div>

          <div class="about-text slide-in-right">
            <h2>Пахан - Мастер барбер</h2>
            
            <p class="lead">
              Я работаю в индустрии барберинга уже <strong>6 лет</strong>. Это моё хобби, которое переросло в профессию, которую я очень люблю и всегда развиваюсь в этой сфере.
            </p>

            <div class="experience-section">
              <h3>Образование и квалификация</h3>
              <ul class="timeline">
                <li>
                  <div class="year">2021</div>
                  <div class="description">
                    Закончил курсы в школе <strong>Давида Сейрановича</strong>
                  </div>
                </li>
                <li>
                  <div class="year">2021</div>
                  <div class="description">
                    Получил квалификацию у топового барбера из Петербурга - <strong>Батреза Бажовака</strong>
                  </div>
                </li>
                <li>
                  <div class="year">2022</div>
                  <div class="description">
                    Получил квалификацию в Ростове-на-Дону у Преподавателя крупнейшей сети Барберов топ <strong>TORGUN - Михаила Гучина</strong>
                  </div>
                </li>
                <li>
                  <div class="year">2024</div>
                  <div class="description">
                    Получил квалификацию у <strong>Данила Зоценка, Дмитрия Ерофеева и Романа Даниева</strong>
                  </div>
                </li>
              </ul>
            </div>

            <div class="philosophy-section glass-card">
              <h3>Моя философия</h3>
              <p>
                Моя цель - это не просто типичные стрижки, но страсть к созданию идеального образа. 
                Я верю, что каждый клиент уникален, и моя задача - подчеркнуть его индивидуальность через качественную работу и внимание к деталям.
              </p>
            </div>

            <div class="services-highlight">
              <h3>Специализация</h3>
              <div class="highlight-grid">
                <div class="highlight-item">
                  <div class="icon">✂️</div>
                  <h4>Классические стрижки</h4>
                  <p>Традиционные мужские стрижки с современным подходом</p>
                </div>
                <div class="highlight-item">
                  <div class="icon">🪒</div>
                  <h4>Бритье и уход</h4>
                  <p>Оформление бороды, усов, королевское бритье</p>
                </div>
                <div class="highlight-item">
                  <div class="icon">💈</div>
                  <h4>Современные тренды</h4>
                  <p>Актуальные стили и техники барберинга</p>
                </div>
                <div class="highlight-item">
                  <div class="icon">👨‍👦</div>
                  <h4>Детские стрижки</h4>
                  <p>Профессиональный подход к самым юным клиентам</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="gallery-section slide-in-up">
          <h2>Примеры работ</h2>
          <div class="gallery-grid">
            <div class="gallery-item glass-card">
              <div class="gallery-placeholder"></div>
            </div>
            <div class="gallery-item glass-card">
              <div class="gallery-placeholder"></div>
            </div>
            <div class="gallery-item glass-card">
              <div class="gallery-placeholder"></div>
            </div>
            <div class="gallery-item glass-card">
              <div class="gallery-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from '../components/TopNav.vue';

export default {
  name: 'About',
  components: {
    TopNav
  }
}
</script>

<style scoped>
.about-page {
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

.about-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

.image-placeholder, .gallery-placeholder {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: var(--bg-card);
  border: 2px solid var(--accent-gold);
  border-radius: 15px;
}

.about-text h2 {
  color: var(--accent-gold);
  font-size: 2rem;
  margin-bottom: 25px;
  letter-spacing: 2px;
}

.lead {
  font-size: 1.2rem;
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: 40px;
}

.lead strong {
  color: var(--accent-gold);
}

.experience-section {
  margin-bottom: 40px;
}

.experience-section h3,
.philosophy-section h3,
.services-highlight h3 {
  color: var(--accent-light);
  font-size: 1.5rem;
  margin-bottom: 25px;
  letter-spacing: 2px;
}

.timeline {
  list-style: none;
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent-gold);
}

.timeline li {
  margin-bottom: 30px;
  position: relative;
}

.timeline li::before {
  content: '';
  position: absolute;
  left: -35px;
  top: 5px;
  width: 10px;
  height: 10px;
  background: var(--accent-gold);
  border-radius: 50%;
  border: 2px solid var(--bg-dark);
}

.year {
  color: var(--accent-gold);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.description {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
}

.description strong {
  color: var(--text-primary);
}

.philosophy-section {
  padding: 30px;
  margin-bottom: 40px;
}

.philosophy-section p {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.8;
  font-style: italic;
}

.services-highlight {
  margin-top: 40px;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.highlight-item {
  padding: 25px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.highlight-item:hover {
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.highlight-item h4 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.highlight-item p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.gallery-section {
  margin-top: 80px;
}

.gallery-section h2 {
  text-align: center;
  color: var(--accent-gold);
  font-size: 2rem;
  margin-bottom: 40px;
  letter-spacing: 3px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.gallery-item {
  padding: 10px;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-placeholder {
  min-height: 300px;
}

@media (max-width: 968px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .image-placeholder {
    min-height: 400px;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 80px;
  }

  .page-title {
    font-size: 2rem;
  }

  .about-text h2 {
    font-size: 1.5rem;
  }

  .lead {
    font-size: 1.1rem;
  }

  .highlight-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-placeholder {
    min-height: 250px;
  }
}
</style>
