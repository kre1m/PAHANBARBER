<template>
  <div class="admin-clients">
    <h1 class="page-title">Клиенты</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="clients.length === 0" class="empty-state">
      <p>Клиентов пока нет</p>
    </div>

    <div v-else class="clients-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Записей</th>
            <th>Потрачено</th>
            <th>Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.id }}</td>
            <td>
              <div class="client-name">
                <span class="avatar-small">{{ client.avatar }}</span>
                {{ client.firstName }} {{ client.lastName }}
              </div>
            </td>
            <td>{{ client.phone }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.appointmentsCount }}</td>
            <td>{{ client.totalSpent || 0 }} ₽</td>
            <td>{{ formatDate(client.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'AdminClients',
  data() {
    return {
      clients: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadClients();
  },
  methods: {
    async loadClients() {
      try {
        const response = await api.adminGetClients();
        this.clients = response.data;
      } catch (err) {
        console.error('Ошибка загрузки клиентов:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU');
    }
  }
}
</script>

<style scoped>
.admin-clients {
  max-width: 1600px;
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

.clients-table {
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
}

td {
  padding: 15px;
  color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.client-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-small {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

@media (max-width: 1200px) {
  .clients-table {
    overflow-x: auto;
  }

  table {
    min-width: 900px;
  }
}
</style>
