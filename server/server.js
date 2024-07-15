require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/ConnectDB');
const emailRoutes = require('./routes/email');

const app = express();


const allowedOrigins = ['https://your-netlify-app.netlify.app'];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 
};


app.use(cors(corsOptions));

app.use(express.json());


connectDB();

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/transaction', require('./routes/transactionRoutes'));
app.use('/api/v1/email', emailRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
