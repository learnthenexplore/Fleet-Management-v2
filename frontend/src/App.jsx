// src/App.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { setUser } from './redux/slices/authSlice';
import { connectSocket } from './sockets/socket';


import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import DriverDashboard from './pages/DriverDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import UserForms from './pages/DriverForms';
import FormDetailView from './pages/FormDetailView';
import LiveTrips from './pages/LiveTrips';
import PreviousTrips from './pages/PreviousTrips';
import OverView from './pages/OverView';
import AllForms from './pages/M_ListAllForm';

import 'leaflet/dist/leaflet.css';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      dispatch(setUser(parsed));
      connectSocket(parsed.id);
    }
  }, [dispatch]);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"  
          element={
            user
              ? user.role === 'operator'
                ? <Navigate to="/driver/dashboard" />
                : <Navigate to="/manager/" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/driver/dashboard"
          element={
            user?.role === 'operator' ? <DriverDashboard /> : <Navigate to="/" />
          }
        />

        <Route
          path="/driver/:id/forms"
          element={
            user?.role === 'operator' ? <UserForms /> : <Navigate to="/" />
          }
        />

        <Route path="/form/:formId" element={<FormDetailView />} />

        {/* Manager dashboard + nested routes */}
   <Route
  path="/manager"
  element={
    user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/" />
  }
>
  <Route index element={<Navigate to="overview" />} />
  <Route path="overview" element={ <OverView/> } />
  <Route path="livetrips" element={<LiveTrips />} />
  <Route path="previoustrips" element={<PreviousTrips />} />
  <Route path="analyse" element={ <AllForms />} />
  <Route path="report" element={<div>Report Page</div>} />
  <Route path="notifications" element={<div>Notification Page</div>} />
</Route>

      </Routes>
    </Router>
  );
}

export default App;
