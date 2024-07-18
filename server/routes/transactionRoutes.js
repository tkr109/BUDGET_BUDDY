const express=require("express")
const { addTransaction, getAllTransaction, editTransaction, deleteTransaction } = require("../controller/transactionController")

const router=express.Router()

router.post('/add-transaction',addTransaction)

router.post('/edit-transaction',editTransaction)

router.post('/del-transaction',deleteTransaction)

router.post('/get-transaction',getAllTransaction)

module.exports=router   