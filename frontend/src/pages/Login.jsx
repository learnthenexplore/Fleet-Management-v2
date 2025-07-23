import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../sockets/socket';
import { BASE_URL } from '../config';

const Login = () => {
  const [form, setForm] = useState({ employeeId: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
      const user = res.data.user;

      dispatch(setUser(user));
      localStorage.setItem('user', JSON.stringify(user));
      connectSocket(user.id);

      if (user.role === 'operator') navigate('/driver/dashboard');
      else navigate('/manager/overview');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.form}>
      <h2>Login</h2>

      <input
        placeholder="Employee ID"
        value={form.employeeId}
        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        required
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        style={styles.input}
      />

      <button type="submit" style={styles.button}>Login</button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '400px',
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default Login;
