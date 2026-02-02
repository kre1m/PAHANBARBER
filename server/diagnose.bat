@echo off
REM Скрипт для проверки состояния приложения

echo.
echo ===============================================
echo   ДИАГНОСТИКА ПРИЛОЖЕНИЯ PAHAN BARBER
echo ===============================================
echo.

echo [1/3] Проверка структуры БД...
node export-db.js > db-export.json 2>&1
if exist db-export.json (
    echo ✓ Файл db-export.json создан
    type db-export.json
) else (
    echo ✗ Ошибка при создании db-export.json
)

echo.
echo [2/3] Проверка доступности сервера...
timeout /t 2 >nul

echo ✓ Для запуска тестов логина используйте: node test-login.js
echo.
echo [3/3] Инструкции:
echo.
echo 1. Откройте браузер 1 и перейдите на http://localhost:5173
echo 2. Откройте DevTools (F12) и перейдите на вкладку "Console"
echo 3. Введите в консоль: JSON.parse(localStorage.getItem('user'))
echo 4. Запишите ID и Email
echo 5. Откройте браузер 2 (или Incognito режим)
echo 6. Повторите шаги 1-4 с другим аккаунтом
echo 7. Сравните ID - они ДОЛЖНЫ быть РАЗНЫМИ
echo.
echo ===============================================
echo.
