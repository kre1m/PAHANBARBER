@echo off
chcp 65001 >nul 2>&1
cls

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║         PAHAN BARBER - ТЕСТИРОВАНИЕ ЛОГИНА/ЗАПИСЕЙ           ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [ИНСТРУКЦИЯ]
echo.
echo 1. Откройте Браузер 1 (обычный режим):
echo    - Перейдите на http://localhost:5173/login
echo    - Зарегистрируйтесь: test1@test.com / TestPass123!
echo    - Откройте F12, вкладка Console
echo    - Введите: JSON.parse(localStorage.getItem('user'))
echo    - ЗАПИШИТЕ ID (например: 2)
echo.
echo 2. Откройте Браузер 2 (Incognito/Приватный режим):
echo    - Перейдите на http://localhost:5173/login
echo    - Зарегистрируйтесь: test2@test.com / TestPass123!
echo    - Откройте F12, вкладка Console
echo    - Введите: JSON.parse(localStorage.getItem('user'))
echo    - ЗАПИШИТЕ ID (должен быть ДРУГОЙ, например: 3)
echo.
echo 3. Проверьте логи сервера (где запущен node server.js)
echo    Должны увидеть:
echo      ✅ Регистрация: test1@test.com - Новый ID: 2
echo      ✅ Регистрация: test2@test.com - Новый ID: 3
echo.
echo 4. Проверьте состояние БД:
echo.
echo ═══════════════════════════════════════════════════════════════
echo [ЗАПУСК ДИАГНОСТИКИ БД]
echo ═══════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0\server" 2>nul || cd /d "%~dp0"

if exist "diagnose-db.js" (
    node diagnose-db.js
) else (
    echo ❌ Файл diagnose-db.js не найден!
    echo    Убедитесь что вы запустили этот батник из папки pahan-barber
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo [ЧТО ПРОВЕРИТЬ]
echo.
echo ✓ ID в Браузере 1 и Браузере 2 должны быть РАЗНЫМИ
echo ✓ Столбец ID в таблице ПОЛЬЗОВАТЕЛИ должны быть уникальны
echo ✓ Логи сервера должны показать разные ID при регистрации
echo ✓ Каждый пользователь видит только свои записи
echo.
pause
