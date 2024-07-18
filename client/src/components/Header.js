import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate=useNavigate();
    const [loginUser,SetloginUser]=useState('')

    useEffect(()=>{
      const user=JSON.parse(localStorage.getItem("user"))
      if(user)
      {
        SetloginUser(user);
      }
    },[])

    const logOutHandler=()=>{
      localStorage.removeItem("user")
      message.success("Logout Successful")
      navigate("/login")
    }

    return (
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand font-weight-bold" href="/">BudgetBuddy</a>
          <span className="navbar-text mr-3">{loginUser && loginUser.name}</span>
          <button className="btn btn-outline-dark" onClick={logOutHandler}>
            Logout
          </button>
        </div>
      </nav>
    );
  };
  
  export default Header;
  