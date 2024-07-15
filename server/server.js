require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/ConnectDB');
const emailRoutes = require('./routes/email');

const app = express();

app.use(express.json());


const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

connectDB();

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/transaction', require('./routes/transactionRoutes'));
app.use('/api/v1/email', emailRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server Started');
});
