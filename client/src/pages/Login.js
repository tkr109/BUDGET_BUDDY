import { Link, useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import "./Login.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { BASE_URL } from "../components/helper";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}api/v1/users/login`, values);
      setLoading(false);
      message.success("Login Success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      setLoading(false);
      navigate("/");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        {loading && <Spinner />}
        <Form layout="vertical" onFinish={submitHandler}>
          <div className="login-form">
            <h1>Login Form</h1>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input type="password" />
            </Form.Item>
            <div className="">
              <Link to="/register">New User? Click Here to Register</Link>
            </div>
            <button className="btn btn-outline-dark mt-3">Login Now</button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
