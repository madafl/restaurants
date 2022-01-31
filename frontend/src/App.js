import React, {useEffect} from "react";
import {Routes, Route, Link,useNavigate  } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddReview from "./components/add-review";
import Restaurant from "./components/restaurant";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";
import Register from "./components/register";
import logo from './logo.png';
import { decodeToken } from "react-jwt";

function App() {
  let navigate = useNavigate();
  const initialUserState = {
    username: "",
    password: "",
  };
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [user, setUser] = React.useState(initialUserState);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  async function login(user) {
    setUser(user);
    setIsLoggedIn(true)
  }

  async function logout() {
    localStorage.clear();
    setUser(initialUserState);
    navigate('/restaurants', { replace: true })
   
  }
  useEffect(() => {
    if (token !== null){
      setIsLoggedIn(true);
      const decodedToken = decodeToken(token);
      setUser({username : decodedToken.username});
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <img className="logo" alt="logo" src={logo}></img> 
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurante
            </Link>
          </li>
          <li className="nav-item" >
          { user.username !== "" ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}  href="http://localhost:3000/">
                Logout {user.username}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<RestaurantsList user ={user} login={login}/>} />
          <Route path="/restaurants" element={<RestaurantsList user ={user} login={login}/>} />
          <Route path="/restaurants/:id" element={<Restaurant user ={user} login={login}/>} /> 
          <Route path="/login" element= {<Login login={login} user ={user} />}/>
          <Route path="/register" element= {<Register />}/>

          <Route path="/restaurants/:id/review" element={<AddReview user = {user} isLoggedIn={isLoggedIn}/>} />
           
          <Route path="*" element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
          /> 
        </Routes>
      </div>
    </div>
  );
}

export default App;