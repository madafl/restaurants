import React, { useState } from "react";
import {Link, useNavigate } from 'react-router-dom';
import RestaurantDataService from "../services/restaurant";

const Login = props => {
  let navigate = useNavigate();
  const initialUserState = {
    username: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [ showPassword, setShowPassword] = useState(false);


  const handleInputChange = event => {
    const [ username, value ] = [event.target.id, event.target.value]; // name/ id = value from the input
    setUser({ ...user, [username]: value });
  };

  const login = () => {
    var data = {
      username: user.username,
      password: user.password,
    }
    if (data.username === null || data.password === null){
      alert("Adaugati un username si o parola!")
    } else {
      RestaurantDataService.login(data)
        .then(response => {
          if (response.data.user === false) {
            alert("Eroare la conectare.")
          } else {
            const token = response.data.user;
            localStorage.setItem('token', JSON.stringify(token))
            props.login(user);
            navigate('/restaurants', { replace: true }) 
          }
        })
        .catch(e => {
          console.log(e);
        })
    }
    
  }
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword)=>!prevShowPassword)
  }
  return (
    <div className="submit-form">
      <div>
        <div>
        <h4> Login </h4> 
        </div>
        <div className="form-group">
          <label htmlFor="user">Nume de utilizator</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            value={user.username}
            onChange={handleInputChange}
            name="username"
          />
        </div>

        <div className="form-group icon-inside">
          <label htmlFor="password">Parola</label>
          <i className={showPassword ? "fa fa-eye-slash fa-2x" : "fa fa-eye fa-2x"} onClick={handleShowPassword }></i> 
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={user.password}
              onChange={handleInputChange}
              name="password" type={showPassword ? "text" : "password" }
            />
        </div>
        <button onClick={login} className="btn btn-success btn-login">
          Login
        </button>
        <Link to={"/register"} className="btn btn-success no-dec-link">
            Creeaza un cont
        </Link>      
        </div>
    </div>
  );
};

export default Login;