const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();



app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/company', require('./src/routes/company'));
app.use('/api/user', require('./src/routes/user'));



app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Server ishlamoqda ✅' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route topilmadi' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server xatosi', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});