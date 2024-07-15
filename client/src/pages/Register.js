import { Link, useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import "./Register.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("api/v1/users/register", values);
      console.log(values)
      message.success("User Register");
      navigate("/login");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  useEffect(()=>{
    if(localStorage.getItem('user'))
    {
        navigate("/")
    }

  },[navigate])

  return (
    <div className="login-container reg">
      {loading && <Spinner />}
      <div className="register-page ">
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Registration Form</h1>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/login">Already Registered ? Login </Link>
          </div>
          <button className="btn btn-outline-dark mt-3">Register</button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
