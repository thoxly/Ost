const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Загрузка переменных окружения из файла .env

const { router: authRoutes, authenticateToken } = require('./routes/auth');
const companyRoutes = require('./routes/company');
const warrantyRoutes = require('./routes/warranty');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', authRoutes);
app.use('/company', authenticateToken, companyRoutes);
app.use('/warranty', authenticateToken, warrantyRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
