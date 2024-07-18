const bcrypt = require('bcrypt');
const userModel = require("../models/userModel");


// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// Register callback
const registerController = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ ...rest, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};
// Update Budget
const updateBudget = async (req, res) => {
  const { userId, budgets } = req.body;

  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedBudgets = { ...user.budgets.toObject(), ...budgets };

    user.budgets = updatedBudgets;
    await user.save();

    res.status(200).json({ message: 'Budgets updated successfully', updatedBudgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating budget' });
  }
};

module.exports = { loginController, registerController, updateBudget };

