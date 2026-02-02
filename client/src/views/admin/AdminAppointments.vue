<template>
  <div class="admin-appointments">
    <div class="page-header">
      <h1 class="page-title">Управление записями</h1>
      <button class="btn-primary" @click="showCreateModal = true">
        + Создать запись
      </button>
    </div>

    <div class="filters">
      <button 
        v-for="status in statuses" 
        :key="status.value"
        class="filter-btn"
        :class="{ active: currentStatus === status.value }"
        @click="filterByStatus(status.value)"
      >
        {{ status.label }}
      </button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="appointments.length === 0" class="empty-state">
      <p>Записей не найдено</p>
    </div>

    <div v-else class="appointments-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Дата</th>
            <th>Время</th>
            <th>Услуги</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="apt in appointments" :key="apt.id">
            <td>{{ apt.id }}</td>
            <td>{{ apt.firstName }} {{ apt.lastName }}</td>
            <td>{{ apt.phone }}</td>
            <td>{{ formatDate(apt.date) }}</td>
            <td>{{ apt.time }}</td>
            <td>
              <div class="services-list">
                <span v-for="(service, idx) in apt.services" :key="idx">
                  {{ service }}
                </span>
              </div>
            </td>
            <td>{{ apt.totalPrice }} ₽</td>
            <td>
              <span class="status-badge" :class="apt.status">
                {{ getStatusLabel(apt.status) }}
              </span>
            </td>
            <td>
              <button 
                v-if="apt.status === 'pending'"
                class="btn-action btn-cancel"
                @click="cancelAppointment(apt.id)"
              >
                Отменить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно создания записи -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content glass-card">
        <button class="modal-close" @click="showCreateModal = false">✕</button>
        
        <h2 class="modal-title">Создать запись</h2>

        <form @submit.prevent="createAppointment" class="create-form">
          <div class="form-group">
            <label>Клиент</label>
            <select v-model="createForm.userId" class="form-select" required>
              <option value="">Выберите клиента</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.firstName }} {{ client.lastName }} ({{ client.phone }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Услуги</label>
            <div class="services-checkboxes">
              <label v-for="service in services" :key="service.name" class="service-checkbox">
                <input 
                  type="checkbox" 
                  :value="service.name"
                  v-model="createForm.services"
                />
                <span>{{ service.name }} - {{ service.price }} руб</span>
              </label>
            </div>
          </div>

          <div v-if="createForm.services.length > 0" class="total-price">
            Итого: {{ totalPrice }} руб
          </div>

          <div class="form-group">
            <label>Дата</label>
            <input type="date" v-model="createForm.date" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Время</label>
            <select v-model="createForm.time" class="form-select" required>
              <option value="">Выберите время</option>
              <option v-for="hour in 12" :key="hour" :value="`${(hour + 8).toString().padStart(2, '0')}:00`">
                {{ (hour + 8).toString().padStart(2, '0') }}:00
              </option>
            </select>
          </div>

          <div v-if="createError" class="error-message">{{ createError }}</div>
          <div v-if="createSuccess" class="success-message">{{ createSuccess }}</div>

          <button 
            type="submit" 
            class="btn-primary"
            :disabled="createLoading || createForm.services.length === 0"
          >
            {{ createLoading ? 'Создание...' : 'Создать запись' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AdminAppointments',
  data() {
    return {
      appointments: [],
      clients: [],
      loading: true,
      currentStatus: null,
      statuses: [
        { value: null, label: 'Все' },
        { value: 'pending', label: 'Ожидают' },
        { value: 'completed', label: 'Завершенные' },
        { value: 'cancelled', label: 'Отмененные' }
      ],
      services: [
        { name: 'Мужская стрижка', price: 1000 },
        { name: 'Оформление бороды и усов', price: 800 },
        { name: 'Комплекс (стрижка + борода)', price: 1300 },
        { name: 'Детская стрижка (до 6 лет)', price: 900 },
        { name: 'Комбо (отец + сын)', price: 1800 },
        { name: 'Восковая депиляция лица', price: 200 }
      ],
      showCreateModal: false,
      createForm: {
        userId: '',
        services: [],
        date: '',
        time: ''
      },
      createLoading: false,
      createError: '',
      createSuccess: ''
    }
  },
  computed: {
    totalPrice() {
      return this.createForm.services.reduce((sum, serviceName) => {
        const service = this.services.find(s => s.name === serviceName);
        return sum + (service ? service.price : 0);
      }, 0);
    }
  },
  async mounted() {
    await this.loadAppointments();
    await this.loadClients();
  },
  methods: {
    async loadAppointments() {
      this.loading = true;
      try {
        const response = await api.adminGetAppointments(this.currentStatus);
        this.appointments = response.data;
      } catch (err) {
        console.error('Ошибка загрузки записей:', err);
      } finally {
        this.loading = false;
      }
    },
    async loadClients() {
      try {
        const response = await api.adminGetClients();
        this.clients = response.data;
      } catch (err) {
        console.error('Ошибка загрузки клиентов:', err);
      }
    },
    filterByStatus(status) {
      this.currentStatus = status;
      this.loadAppointments();
    },
    async cancelAppointment(id) {
      if (!confirm('Отменить эту запись?')) return;

      try {
        await api.adminCancelAppointment(id);
        await this.loadAppointments();
      } catch (err) {
        alert('Ошибка отмены записи');
      }
    },
    async createAppointment() {
      this.createLoading = true;
      this.createError = '';
      this.createSuccess = '';

      try {
        await api.adminCreateAppointment({
          userId: this.createForm.userId,
          services: this.createForm.services,
          date: this.createForm.date,
          time: this.createForm.time,
          totalPrice: this.totalPrice
        });

        this.createSuccess = 'Запись создана!';
        
        await this.loadAppointments();
        
        setTimeout(() => {
          this.showCreateModal = false;
          this.createForm = { userId: '', services: [], date: '', time: '' };
          this.createSuccess = '';
        }, 1500);
      } catch (err) {
        this.createError = err.response?.data?.error || 'Ошибка создания записи';
      } finally {
        this.createLoading = false;
      }
    },
    getStatusLabel(status) {
      const labels = {
        pending: 'Ожидает',
        completed: 'Завершена',
        cancelled: 'Отменена'
      };
      return labels[status] || status;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU');
    }
  }
}
</script>

<style scoped>
.admin-appointments {
  max-width: 1600px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #ffffff;
  font-size: 2rem;
  margin: 0;
  letter-spacing: 2px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-btn {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: #d4af37;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255, 255, 255, 0.5);
}

.appointments-table {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

td {
  padding: 15px;
  color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.services-list span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-badge.completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-badge.cancelled {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.btn-action {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
}

.btn-cancel:hover {
  background: #ff6b6b;
  color: white;
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
  z-index: 3000;
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
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #d4af37;
}

.modal-title {
  text-align: center;
  color: #d4af37;
  margin-bottom: 30px;
  font-size: 1.8rem;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-input,
.form-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #d4af37;
}

.services-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.service-checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
}

.service-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.total-price {
  text-align: center;
  font-size: 1.3rem;
  color: #d4af37;
  font-weight: 600;
  padding: 12px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
}

.success-message {
  color: #51cf66;
  text-align: center;
  padding: 10px;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 8px;
}

@media (max-width: 1200px) {
  .appointments-table {
    overflow-x: auto;
  }

  table {
    min-width: 1000px;
  }
}
</style>
