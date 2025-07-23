// File: src/pages/UserForms.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../config';
import './DriverForms.css'; // Import pure CSS

const UserForms = () => {
  const { user } = useSelector((state) => state.auth);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/form/user/${user.id}/forms`);
        const data = Array.isArray(response.data) ? response.data : [];
        setForms(data);
      } catch (error) {
        console.error('Error fetching forms:', error);
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [user.id]);

  const handleView = (formId) => {
    navigate(`/form/${formId}`);
  };

  const handleBack = () => {
    navigate('/driver/dashboard');
  };

  return (
    <div className="user-forms-container">
      <div className="user-forms-header">
        <h1 className="user-forms-title">Welcome Back!</h1>
        <p className="user-forms-subtitle">Work carefully, your life is precious 🚧</p>
        <button onClick={handleBack} className="user-forms-back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="user-forms-list-container">
        {loading ? (
          <p className="user-forms-loading">Loading...</p>
        ) : forms.length === 0 ? (
          <p className="user-forms-empty">You have no work to show.</p>
        ) : (
          <ul className="user-forms-list">
            {forms.map((form) => (
              <li key={form._id} className="user-forms-list-item">
                <div>
                  <p className="user-forms-item-date">Date: {form.date}</p>
                  <p className="user-forms-item-vehicle">Vehicle: {form.dumperNumber}</p>
                </div>
                <button
                  onClick={() => handleView(form.formId)}
                  className="user-forms-view-button"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserForms;
