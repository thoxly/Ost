const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { createContact, createCompany } = require('../utils/elmaApi');

const usersFilePath = path.join(__dirname, '../users.json');

const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to users file:', error);
  }
};

router.post('/register', async (req, res) => {
  const { companyName, companyInn, companyKpp, contactPhone, contactFirstName, contactLastName, contactMiddleName, contactEmail, contactTelegram, password } = req.body;

  const contactData = {
    context: {
      "__name": `${contactLastName} ${contactFirstName} ${contactMiddleName}`,
      "_fullname": {
        "lastname": contactLastName,
        "middlename": contactMiddleName,
        "firstname": contactFirstName
      },
      "_phone": [
        {
          "type": "home",
          "tel": contactPhone
        }
      ],
      "_email": [
        {
          "type": "home",
          "email": contactEmail
        }
      ],
      "_account": [
        {
          "login": contactTelegram,
          "type": "telegram"
        }
      ]
    },
    "statusGroupId": "a35cd8de-0c73-4f6a-8218-90193d02e2e0",
    "withEventForceCreate": true
  };

  try {
    const contactResponse = await createContact(contactData);
    const contactId = contactResponse.item.__id;

    const companyData = {
      context: {
        "__name": companyName,
        "_phone": [
          {
            "type": "home",
            "tel": contactPhone
          }
        ],
        "_email": [
          {
            "type": "home",
            "email": contactEmail
          }
        ],
        "_inn": companyInn,
        "_kpp": companyKpp,
        "_contacts": [
          contactId
        ]
      },
      "statusGroupId": "a35cd8de-0c73-4f6a-8218-90193d02e2e0",
      "withEventForceCreate": true
    };

    const companyResponse = await createCompany(companyData);
    const companyId = companyResponse.item.__id;

    const users = readUsersFromFile();
    users.push({
      companyName,
      companyInn,
      companyKpp,
      contactPhone,
      contactFirstName,
      contactLastName,
      contactMiddleName,
      contactEmail,
      contactTelegram,
      password
    });
    writeUsersToFile(users);

    res.status(201).send({ message: 'Регистрация прошла успешно' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: 'Ошибка при регистрации', error: error.message });
  }
});

router.post('/login', (req, res) => {
  const { inn, password } = req.body;

  const users = readUsersFromFile();
  const user = users.find(user => user.companyInn === inn && user.password === password);

  if (!user) {
    return res.status(401).send({ message: 'Неверный ИНН или пароль' });
  }

  const token = jwt.sign({ inn: user.companyInn }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken };
