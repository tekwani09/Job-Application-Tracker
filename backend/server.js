const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//dotenv.config();
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

connectDB();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));


const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
