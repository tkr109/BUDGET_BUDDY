const express = require('express');
const nodemailer = require('nodemailer');
const Transaction = require('../models/transactionModel'); // Adjust the path as needed

const router = express.Router();

// Configure Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.AUTH_PASS, // Use an app password if 2FA is enabled
  },
});

// Send transaction summary
router.post('/send-summary', async (req, res) => {
  const { userId, email, startDate, endDate } = req.body;

  try {
    const transactions = await Transaction.find({
      userid: userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    // Check if there are any transactions
    if (transactions.length === 0) {
      return res.status(200).send({ message: 'No transactions found for the specified dates.' });
    }

    const dailySummary = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!dailySummary[date]) {
        dailySummary[date] = { totalIncome: 0, totalExpense: 0 };
      }
      if (transaction.type === 'income') {
        dailySummary[date].totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        dailySummary[date].totalExpense += transaction.amount;
      }
    });

    console.log('Daily Summary:', dailySummary); // Debug logging

    let summary = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">Transaction Summary</h2>
        <p style="text-align: center; color: #666;">From ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="background-color: #4CAF50; color: white; padding: 10px; border: 1px solid #ddd;">Date</th>
              <th style="background-color: #4CAF50; color: white; padding: 10px; border: 1px solid #ddd;">Total Income</th>
              <th style="background-color: #4CAF50; color: white; padding: 10px; border: 1px solid #ddd;">Total Expenses</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const date in dailySummary) {
      summary += `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
          <td style="padding: 10px; border: 1px solid #ddd; color: green;">${dailySummary[date].totalIncome}</td>
          <td style="padding: 10px; border: 1px solid #ddd; color: red;">${dailySummary[date].totalExpense}</td>
        </tr>
      `;
    }

    summary += `
          </tbody>
        </table>
      </div>
    `;

    const mailOptions = {
      from: 'aryan109thakur@gmail.com',
      to: email,
      subject: 'Transaction Summary',
      html: summary,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Failed to send email', error });
  }
});

module.exports = router;
