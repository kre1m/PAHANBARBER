<template>
  <div class="auth-page">
    <div class="auth-background"></div>
    
    <div class="auth-container fade-in">
      <div class="auth-card glass-card">
        <h1 class="auth-title">PAHAN BARBER</h1>
        <p class="auth-subtitle">Вход</p>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="Email" 
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Пароль" 
              required
              class="form-input"
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button 
            type="submit" 
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>

          <p class="auth-switch">
            Нет аккаунта? 
            <router-link to="/register">Зарегистрироваться</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        // Полностью очищаем localStorage ПЕРЕД новым логином
        localStorage.clear();
        sessionStorage.clear();
        
        const response = await api.login(this.form);
        console.log('🔐 Login response:', response.data.user);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('💾 Saved to localStorage:', {
          token: localStorage.getItem('token'),
          user: JSON.parse(localStorage.getItem('user'))
        });
        
        // Редирект в зависимости от роли
        if (response.data.user.role === 'admin') {
          this.$router.push('/admin');
        } else {
          this.$router.push('/home');
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Ошибка входа';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}

.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(30, 30, 30, 0.8) 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d4af37" opacity="0.03" width="100" height="100"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23d4af37" stroke-width="0.5" opacity="0.1"/></svg>');
  background-size: cover, 50px 50px;
  z-index: -1;
}

.auth-container {
  width: 100%;
  max-width: 450px;
  z-index: 1;
}

.auth-card {
  padding: 50px 40px;
}

.auth-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--accent-gold);
  margin-bottom: 10px;
  letter-spacing: 4px;
}

.auth-subtitle {
  text-align: center;
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-gold);
  background: rgba(255, 255, 255, 0.08);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  font-size: 0.95rem;
}

.btn-primary {
  margin-top: 10px;
  width: 100%;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  color: var(--text-secondary);
  margin-top: 10px;
}

.auth-switch a {
  color: var(--accent-gold);
  text-decoration: none;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.auth-switch a:hover {
  color: var(--accent-light);
}

@media (max-width: 768px) {
  .auth-card {
    padding: 40px 25px;
  }

  .auth-title {
    font-size: 2rem;
  }

  .auth-subtitle {
    font-size: 1.1rem;
  }
}
</style>
