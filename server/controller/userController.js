const userModel = require("../models/userModel");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).send("User Not Found");
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

//Register Callback
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
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


const updateBudget =async (req, res) => {
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
