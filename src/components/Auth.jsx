import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css'; // Import the CSS file
import Cookies from 'js-cookie';
import { Toaster, toast } from 'sonner'; // Import the Toaster and toast
import { socket } from '../App';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      loginUser();
    } else {
      signUpUser();
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE}/api/v1/user/login`, { email, password });
      toast.success(`Login successful: ${response.data.message}`);
      socket.emit("takeUser",{user_id:response.data.user._id});
      window.localStorage.setItem("user",JSON.stringify({user_id:response.data.user._id}))
      Cookies.set('token', response.data.token, { path: '/', secure: true, sameSite: 'Strict' });
      navigate('/jobs');
    } catch (error) {
      toast.error('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const signUpUser = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE}/api/v1/user/signup`, { email, password });
      toast.success(`Sign-up successful: ${response.data.message}`);
      Cookies.set('token', response.data.token, { path: '/', secure: true, sameSite: 'Strict' });
      socket.emit("takeUser",{user_id:response.data.user._id});
      window.localStorage.setItem("user",JSON.stringify({user_id:response.data.user._id}))
      navigate('/jobs');
    } catch (error) {
      toast.error('Sign-up failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-center" /> {/* Toaster component */}
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default Auth;

