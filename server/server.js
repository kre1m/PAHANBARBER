const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Подаём статические файлы фронтенда
const path = require('path');
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback - все неизвестные маршруты ведут на index.html
app.get('*', (req, res, next) => {
  // Пропускаем API маршруты
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Инициализация базы данных
const db = new sqlite3.Database('./barber.db', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключено к базе данных SQLite');
    initDatabase();
  }
});

// Список временных email сервисов
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwaway.email', 'getnada.com', 'temp-mail.org', 'maildrop.cc',
  'yopmail.com', 'fakeinbox.com', 'trashmail.com', 'dispostable.com'
];

// Создание таблиц
function initDatabase() {
  db.serialize(() => {
    // Таблица пользователей с ролями
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '😊',
        role TEXT DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица записей с обновленными статусами
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        services TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        totalPrice INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        reviewId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Таблица отзывов привязанных к записям
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        appointmentId INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (appointmentId) REFERENCES appointments(id),
        UNIQUE(appointmentId)
      )
    `);

    // Таблица уведомлений
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Таблица рабочего расписания
    db.run(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dayOfWeek INTEGER NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        isActive INTEGER DEFAULT 1
      )
    `);

    // Таблица блокировок времени
    db.run(`
      CREATE TABLE IF NOT EXISTS blocked_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT,
        reason TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Создаем админ аккаунт если его нет
    createAdminAccount();

    // Создаем стандартное расписание
    initializeSchedule();
  });
}

// Создание админ аккаунта
async function createAdminAccount() {
  const adminEmail = 'admin@pahanbarber.ru';
  
  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, user) => {
    if (err) {
      console.error('Ошибка проверки админа:', err);
      return;
    }
    
    if (!user) {
      const hashedPassword = await bcrypt.hash('PahanAdmin2024!', 10);
      db.run(
        `INSERT INTO users (firstName, lastName, phone, email, password, role, avatar) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['Админ', 'Панель', '+79999999999', adminEmail, hashedPassword, 'admin', '👑'],
        (err) => {
          if (err) {
            console.error('Ошибка создания админа:', err);
          } else {
            console.log('✅ Админ аккаунт создан: admin@pahanbarber.ru / PahanAdmin2024!');
          }
        }
      );
    }
  });
}

// Инициализация стандартного расписания (9:00 - 21:00 ежедневно)
function initializeSchedule() {
  db.get('SELECT COUNT(*) as count FROM schedule', (err, row) => {
    if (err || row.count > 0) return;
    
    for (let day = 0; day < 7; day++) {
      db.run(
        'INSERT INTO schedule (dayOfWeek, startTime, endTime, isActive) VALUES (?, ?, ?, ?)',
        [day, '09:00', '21:00', 1]
      );
    }
    console.log('✅ Стандартное расписание создано');
  });
}

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки роли админа
const requireAdmin = (req, res, next) => {
  db.get('SELECT role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    next();
  });
};

// Функция валидации пароля
function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, error: 'Пароль должен содержать минимум 8 символов' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать строчную букву' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать заглавную букву' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать цифру' };
  }
  return { valid: true };
}

// Функция проверки временного email
function isTempEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return TEMP_EMAIL_DOMAINS.includes(domain);
}

// Функция создания уведомления
function createNotification(userId, type, message) {
  db.run(
    'INSERT INTO notifications (userId, type, message) VALUES (?, ?, ?)',
    [userId, type, message]
  );
}

// Функция автоматического завершения записей
function checkAndCompleteAppointments() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  db.all(
    `SELECT * FROM appointments 
     WHERE status = 'pending' 
     AND (date < ? OR (date = ? AND time < ?))`,
    [currentDate, currentDate, currentTime],
    (err, appointments) => {
      if (err || !appointments) return;
      
      appointments.forEach(apt => {
        const aptDateTime = new Date(`${apt.date}T${apt.time}`);
        const oneHourLater = new Date(aptDateTime.getTime() + 60 * 60 * 1000);
        
        if (now >= oneHourLater) {
          db.run(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['completed', apt.id],
            () => {
              createNotification(
                apt.userId,
                'review_request',
                `Оставьте отзыв о посещении ${new Date(apt.date).toLocaleDateString('ru-RU')}`
              );
            }
          );
        }
      });
    }
  );
}

// Запускаем проверку каждую минуту
setInterval(checkAndCompleteAppointments, 60000);
checkAndCompleteAppointments(); // Проверка при старте

// ROUTES

// Регистрация
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, phone, email, password, avatar } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  // Проверка временного email
  if (isTempEmail(email)) {
    return res.status(400).json({ error: 'Использование временных email запрещено' });
  }

  // Валидация пароля
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return res.status(400).json({ error: passwordCheck.error });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      `INSERT INTO users (firstName, lastName, phone, email, password, avatar) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, phone, email, hashedPassword, avatar || '😊'],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: users.phone')) {
            return res.status(400).json({ error: 'Этот номер телефона уже зарегистрирован' });
          }
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(400).json({ error: 'Этот email уже зарегистрирован' });
          }
          console.error('❌ Ошибка INSERT:', err);
          return res.status(500).json({ error: 'Ошибка регистрации' });
        }

        console.log('✅ Регистрация:', email, '- Новый ID:', this.lastID);
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ 
          message: 'Регистрация успешна',
          token,
          user: { 
            id: this.lastID, 
            firstName, 
            lastName, 
            phone, 
            email, 
            avatar: avatar || '😊',
            role: 'user'
          }
        });
      }
    );
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    console.log('🔐 Вход пользователя:', user.email, 'ID:', user.id, 'Role:', user.role);
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ 
      token,
      user: { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        phone: user.phone, 
        email: user.email, 
        avatar: user.avatar,
        role: user.role
      }
    });
  });
});

// Получить профиль пользователя
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, firstName, lastName, phone, email, avatar, role FROM users WHERE id = ?', 
    [req.user.id], 
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.json(user);
    }
  );
});

// Обновить профиль
app.put('/api/profile', authenticateToken, (req, res) => {
  const { firstName, lastName, phone, avatar } = req.body;

  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, phone = ?, avatar = ? WHERE id = ?',
    [firstName, lastName, phone, avatar, req.user.id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed: users.phone')) {
          return res.status(400).json({ error: 'Этот номер телефона уже используется' });
        }
        return res.status(500).json({ error: 'Ошибка обновления профиля' });
      }
      res.json({ message: 'Профиль обновлен' });
    }
  );
});

// Получить уведомления
app.get('/api/notifications', authenticateToken, (req, res) => {
  console.log('📬 Запрос уведомлений для userId:', req.user.id);
  
  db.all(
    'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
    [req.user.id],
    (err, notifications) => {
      if (err) {
        console.error('❌ Ошибка при получении уведомлений:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      console.log('✅ Найдено уведомлений:', notifications?.length || 0);
      res.json(notifications || []);
    }
  );
});

// Отметить уведомление прочитанным
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
  console.log('✓ Отметить уведомление как прочитанное:', req.params.id);
  
  db.run(
    'UPDATE notifications SET read = 1 WHERE id = ? AND userId = ?',
    [req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json({ message: 'Уведомление прочитано' });
    }
  );
});

// Отметить все уведомления прочитанными
app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
  console.log('✓ Отметить все уведомления как прочитанные для userId:', req.user.id);
  
  db.run(
    'UPDATE notifications SET read = 1 WHERE userId = ?',
    [req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json({ message: 'Все уведомления прочитаны' });
    }
  );
});

// Получить доступные слоты
app.get('/api/available-slots', (req, res) => {
  const today = new Date();
  const slots = [];
  
  db.all('SELECT * FROM schedule WHERE isActive = 1', (err, schedules) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    // Генерируем слоты на месяц вперед
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek);
      if (!schedule) continue;

      const [startHour] = schedule.startTime.split(':').map(Number);
      const [endHour] = schedule.endTime.split(':').map(Number);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        slots.push({ date: dateStr, time });
      }
    }

    // Получаем забронированные и заблокированные слоты
    db.all(
      `SELECT date, time FROM appointments WHERE status = 'pending'
       UNION
       SELECT date, time FROM blocked_slots WHERE time IS NOT NULL`,
      [],
      (err, bookedSlots) => {
        if (err) {
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        const bookedSet = new Set(bookedSlots.map(slot => `${slot.date}_${slot.time}`));
        const availableSlots = slots.filter(slot => !bookedSet.has(`${slot.date}_${slot.time}`));

        res.json(availableSlots);
      }
    );
  });
});

// Создать запись
app.post('/api/appointments', authenticateToken, (req, res) => {
  const { services, date, time, totalPrice } = req.body;
  
  console.log('🔍 Создание записи - userId:', req.user.id, 'email:', req.user.email);

  if (!services || !date || !time || !totalPrice) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  // Проверяем доступность слота
  db.get(
    'SELECT * FROM appointments WHERE date = ? AND time = ? AND status = "pending"',
    [date, time],
    (err, existingAppointment) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      if (existingAppointment) {
        return res.status(400).json({ error: 'Это время уже занято' });
      }

      db.run(
        'INSERT INTO appointments (userId, services, date, time, totalPrice) VALUES (?, ?, ?, ?, ?)',
        [req.user.id, JSON.stringify(services), date, time, totalPrice],
        function(err) {
          if (err) {
            console.error('❌ Ошибка INSERT:', err);
            return res.status(500).json({ error: 'Ошибка создания записи' });
          }
          
          console.log('✅ Запись создана с ID:', this.lastID, 'для userId:', req.user.id);

          // Создаем уведомление
          const dateFormatted = new Date(date).toLocaleDateString('ru-RU');
          createNotification(
            req.user.id,
            'appointment_created',
            `Вы записаны на ${dateFormatted} в ${time}`
          );

          res.status(201).json({ 
            message: 'Запись создана',
            appointmentId: this.lastID 
          });
        }
      );
    }
  );
});

// Получить записи пользователя
app.get('/api/appointments', authenticateToken, (req, res) => {
  console.log('📋 Запрос записей для userId:', req.user.id, 'email:', req.user.email);
  
  db.all(
    'SELECT * FROM appointments WHERE userId = ? ORDER BY date DESC, time DESC',
    [req.user.id],
    (err, appointments) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      
      console.log('✅ Найдено записей:', appointments?.length || 0, 'для userId:', req.user.id);
      
      const formattedAppointments = appointments.map(apt => ({
        ...apt,
        services: JSON.parse(apt.services)
      }));
      
      res.json(formattedAppointments);
    }
  );
});

// Отменить запись
app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
  db.get(
    'SELECT * FROM appointments WHERE id = ? AND userId = ?',
    [req.params.id, req.user.id],
    (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      if (!appointment) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }

      db.run(
        'UPDATE appointments SET status = "cancelled" WHERE id = ?',
        [req.params.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Ошибка отмены записи' });
          }

          // Создаем уведомление
          const dateFormatted = new Date(appointment.date).toLocaleDateString('ru-RU');
          createNotification(
            req.user.id,
            'appointment_cancelled',
            `Вы отменили запись на ${dateFormatted} в ${appointment.time}`
          );

          res.json({ message: 'Запись отменена' });
        }
      );
    }
  );
});

// Создать отзыв (привязан к записи)
app.post('/api/reviews', authenticateToken, (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  if (!appointmentId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }

  // Проверяем, что запись завершена и принадлежит пользователю
  db.get(
    'SELECT * FROM appointments WHERE id = ? AND userId = ? AND status = "completed"',
    [appointmentId, req.user.id],
    (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      if (!appointment) {
        return res.status(400).json({ error: 'Запись не найдена или еще не завершена' });
      }

      // Проверяем, нет ли уже отзыва
      db.get(
        'SELECT * FROM reviews WHERE appointmentId = ?',
        [appointmentId],
        (err, existingReview) => {
          if (err) {
            return res.status(500).json({ error: 'Ошибка сервера' });
          }

          if (existingReview) {
            return res.status(400).json({ error: 'Отзыв уже оставлен' });
          }

          db.run(
            'INSERT INTO reviews (userId, appointmentId, rating, comment) VALUES (?, ?, ?, ?)',
            [req.user.id, appointmentId, rating, comment],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Ошибка создания отзыва' });
              }

              // Обновляем запись
              db.run(
                'UPDATE appointments SET reviewId = ? WHERE id = ?',
                [this.lastID, appointmentId]
              );

              res.status(201).json({ 
                message: 'Отзыв добавлен',
                reviewId: this.lastID 
              });
            }
          );
        }
      );
    }
  );
});

// Обновить отзыв
app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Некорректный рейтинг' });
  }

  db.run(
    'UPDATE reviews SET rating = ?, comment = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?',
    [rating, comment, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка обновления отзыва' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Отзыв не найден' });
      }
      res.json({ message: 'Отзыв обновлен' });
    }
  );
});

// Получить все отзывы
app.get('/api/reviews', (req, res) => {
  db.all(
    `SELECT reviews.*, users.firstName, users.lastName, users.avatar 
     FROM reviews 
     JOIN users ON reviews.userId = users.id 
     ORDER BY reviews.createdAt DESC`,
    [],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json(reviews);
    }
  );
});

// Получить отзывы пользователя
app.get('/api/reviews/my', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM reviews WHERE userId = ? ORDER BY createdAt DESC',
    [req.user.id],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json(reviews);
    }
  );
});

// ============ ADMIN ROUTES ============

// Получить все записи (админ)
app.get('/api/admin/appointments', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.query;
  
  let query = `
    SELECT appointments.*, users.firstName, users.lastName, users.phone, users.email
    FROM appointments 
    JOIN users ON appointments.userId = users.id
  `;
  
  if (status) {
    query += ` WHERE appointments.status = ?`;
  }
  
  query += ' ORDER BY appointments.date DESC, appointments.time DESC';

  const params = status ? [status] : [];

  db.all(query, params, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    
    const formatted = appointments.map(apt => ({
      ...apt,
      services: JSON.parse(apt.services)
    }));
    
    res.json(formatted);
  });
});

// Создать запись от имени клиента (админ)
app.post('/api/admin/appointments', authenticateToken, requireAdmin, (req, res) => {
  const { userId, services, date, time, totalPrice } = req.body;

  if (!userId || !services || !date || !time || !totalPrice) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  db.run(
    'INSERT INTO appointments (userId, services, date, time, totalPrice) VALUES (?, ?, ?, ?, ?)',
    [userId, JSON.stringify(services), date, time, totalPrice],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка создания записи' });
      }

      const dateFormatted = new Date(date).toLocaleDateString('ru-RU');
      createNotification(
        userId,
        'appointment_created',
        `Администратор записал вас на ${dateFormatted} в ${time}`
      );

      res.status(201).json({ 
        message: 'Запись создана',
        appointmentId: this.lastID 
      });
    }
  );
});

// Отменить запись (админ)
app.delete('/api/admin/appointments/:id', authenticateToken, requireAdmin, (req, res) => {
  db.get('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err, appointment) => {
    if (err || !appointment) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    db.run(
      'UPDATE appointments SET status = "cancelled" WHERE id = ?',
      [req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Ошибка отмены записи' });
        }

        const dateFormatted = new Date(appointment.date).toLocaleDateString('ru-RU');
        createNotification(
          appointment.userId,
          'appointment_cancelled',
          `Ваша запись на ${dateFormatted} в ${appointment.time} отменена администратором`
        );

        res.json({ message: 'Запись отменена' });
      }
    );
  });
});

// Получить все отзывы (админ)
app.get('/api/admin/reviews', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT reviews.*, users.firstName, users.lastName, users.phone, users.avatar,
     appointments.date, appointments.time
     FROM reviews 
     JOIN users ON reviews.userId = users.id
     JOIN appointments ON reviews.appointmentId = appointments.id
     ORDER BY reviews.createdAt DESC`,
    [],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json(reviews);
    }
  );
});

// Удалить отзыв (админ)
app.delete('/api/admin/reviews/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(
    'DELETE FROM reviews WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка удаления отзыва' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Отзыв не найден' });
      }
      res.json({ message: 'Отзыв удален' });
    }
  );
});

// Получить расписание
app.get('/api/admin/schedule', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM schedule ORDER BY dayOfWeek', (err, schedule) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(schedule);
  });
});

// Обновить расписание
app.put('/api/admin/schedule/:id', authenticateToken, requireAdmin, (req, res) => {
  const { startTime, endTime, isActive } = req.body;

  db.run(
    'UPDATE schedule SET startTime = ?, endTime = ?, isActive = ? WHERE id = ?',
    [startTime, endTime, isActive ? 1 : 0, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка обновления расписания' });
      }
      res.json({ message: 'Расписание обновлено' });
    }
  );
});

// Получить заблокированные слоты
app.get('/api/admin/blocked-slots', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM blocked_slots ORDER BY date, time', (err, slots) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json(slots);
  });
});

// Добавить заблокированный слот
app.post('/api/admin/blocked-slots', authenticateToken, requireAdmin, (req, res) => {
  const { date, time, reason } = req.body;

  db.run(
    'INSERT INTO blocked_slots (date, time, reason) VALUES (?, ?, ?)',
    [date, time, reason],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка блокировки слота' });
      }
      res.status(201).json({ 
        message: 'Слот заблокирован',
        id: this.lastID 
      });
    }
  );
});

// Удалить заблокированный слот
app.delete('/api/admin/blocked-slots/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run(
    'DELETE FROM blocked_slots WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка удаления блокировки' });
      }
      res.json({ message: 'Блокировка удалена' });
    }
  );
});

// Получить статистику (админ)
app.get('/api/admin/statistics', authenticateToken, requireAdmin, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  db.all(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN date = ? THEN 1 ELSE 0 END) as today,
      SUM(CASE WHEN date >= ? THEN 1 ELSE 0 END) as thisWeek,
      SUM(CASE WHEN status = 'completed' THEN totalPrice ELSE 0 END) as totalRevenue
    FROM appointments`,
    [today, weekAgo],
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      db.get('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"', (err, users) => {
        if (err) {
          return res.status(500).json({ error: 'Ошибка сервера' });
        }

        db.get('SELECT COUNT(*) as totalReviews, AVG(rating) as avgRating FROM reviews', (err, reviews) => {
          if (err) {
            return res.status(500).json({ error: 'Ошибка сервера' });
          }

          res.json({
            ...stats[0],
            totalUsers: users.totalUsers,
            totalReviews: reviews.totalReviews,
            avgRating: reviews.avgRating ? parseFloat(reviews.avgRating).toFixed(1) : 0
          });
        });
      });
    }
  );
});

// Получить всех клиентов
app.get('/api/admin/clients', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT users.*, 
     COUNT(appointments.id) as appointmentsCount,
     SUM(CASE WHEN appointments.status = 'completed' THEN appointments.totalPrice ELSE 0 END) as totalSpent
     FROM users 
     LEFT JOIN appointments ON users.id = appointments.userId
     WHERE users.role = 'user'
     GROUP BY users.id
     ORDER BY users.createdAt DESC`,
    [],
    (err, clients) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      res.json(clients);
    }
  );
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 Админ панель: admin@pahanbarber.ru / PahanAdmin2024!`);
});
