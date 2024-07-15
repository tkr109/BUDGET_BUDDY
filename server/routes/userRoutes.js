const express=require("express")
const { loginController, registerController, updateBudget } = require("../controller/userController")

const router=express.Router()

router.post('/login',loginController)

router.post('/register',registerController)

router.post('/update-budget', updateBudget)

module.exports=router