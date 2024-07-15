require('dotenv').config()
const express=require("express")
const connectDB = require("./config/ConnectDB")
const emailRoutes = require('./routes/email');

const app=express()

app.use(express.json())

connectDB()

app.use('/api/v1/users',require('./routes/userRoutes'))
app.use('/api/v1/transaction',require('./routes/transactionRoutes'))
app.use('/api/v1/email', emailRoutes);


app.listen(process.env.PORT,()=>{
    console.log("Server Started")
})