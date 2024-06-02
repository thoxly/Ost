// src/routes/company.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./auth'); 

const USERS_FILE_PATH = path.join(__dirname, '..', 'users.json');

// Middleware для авторизации
router.use(authenticateToken);

// Чтение пользователей из файла
function readUsersFromFile() {
  const fileContent = fs.readFileSync(USERS_FILE_PATH);
  return JSON.parse(fileContent);
}

// Маршрут для получения данных компании
router.get('/', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const inn = decoded.inn;

  const users = readUsersFromFile();
  const user = users.find(u => u.companyInn === inn);

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  res.json({
    companyName: user.companyName,
    companyInn: user.companyInn,
    companyKpp: user.companyKpp,
    contactPhone: user.contactPhone,
    contactLastName: user.contactLastName,
    contactFirstName: user.contactFirstName,
    contactMiddleName: user.contactMiddleName,
    contactEmail: user.contactEmail,
    contactTelegram: user.contactTelegram
  });
});

module.exports = router;
