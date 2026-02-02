<template>
  <div class="admin-schedule">
    <h1 class="page-title">Управление расписанием</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else class="schedule-grid">
      <div v-for="day in schedule" :key="day.id" class="schedule-card glass-card">
        <h3>{{ getDayName(day.dayOfWeek) }}</h3>
        
        <div class="schedule-form">
          <div class="form-group">
            <label>Начало</label>
            <input 
              type="time" 
              v-model="day.startTime" 
              class="form-input"
              :disabled="!day.isActive"
            />
          </div>

          <div class="form-group">
            <label>Конец</label>
            <input 
              type="time" 
              v-model="day.endTime" 
              class="form-input"
              :disabled="!day.isActive"
            />
          </div>

          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="day.isActive"
              @change="day.isActive = day.isActive ? 1 : 0"
            />
            <span>Рабочий день</span>
          </label>

          <button 
            class="btn-save"
            @click="updateSchedule(day)"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AdminSchedule',
  data() {
    return {
      schedule: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadSchedule();
  },
  methods: {
    async loadSchedule() {
      try {
        const response = await api.adminGetSchedule();
        this.schedule = response.data;
      } catch (err) {
        console.error('Ошибка загрузки расписания:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateSchedule(day) {
      try {
        await api.adminUpdateSchedule(day.id, {
          startTime: day.startTime,
          endTime: day.endTime,
          isActive: day.isActive
        });
        alert('Расписание обновлено!');
      } catch (err) {
        alert('Ошибка обновления расписания');
      }
    },
    getDayName(dayOfWeek) {
      const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      return days[dayOfWeek];
    }
  }
}
</script>

<style scoped>
.admin-schedule {
  max-width: 1400px;
}

.page-title {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.loading {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.5);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.schedule-card {
  padding: 25px;
}

.schedule-card h3 {
  color: #d4af37;
  font-size: 1.3rem;
  margin-bottom: 20px;
  text-align: center;
}

.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 10px;
  border-radius: 8px;
}

.form-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.btn-save {
  background: transparent;
  border: 1px solid #51cf66;
  color: #51cf66;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-save:hover {
  background: #51cf66;
  color: white;
}
</style>
