import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

const EmailSummary = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [startDate, endDate] = values.dates;

    try {
      setLoading(true);
      await axios.post('/api/v1/email/send-summary', {
        userId: user._id,
        email: values.email,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setLoading(false);
      message.success('Summary email sent successfully');
    } catch (error) {
      setLoading(false);
      message.error('Failed to send summary email');
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input the email address' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Date Range"
        name="dates"
        rules={[{ required: true, message: 'Please select the date range' }]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Send Summary
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailSummary;
