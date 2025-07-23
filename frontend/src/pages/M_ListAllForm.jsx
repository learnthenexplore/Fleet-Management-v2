import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './M_ListAllForm.css'; // 👈 Ensure you import the CSS for styling

const AllForms = () => {
  const navigate = useNavigate();
  const { forms } = useSelector((state) => state.form); // All forms from Redux

  const handleView = (formId) => {
    navigate(`/form/${formId}`);
  };

  const handleBack = () => {
    navigate('/manager/overview');
  };

  return (
    <div className="user-forms-container">
      <div className="user-forms-header">
        <h1 className="user-forms-title">Welcome Back!</h1>
        <p className="user-forms-subtitle"> Take timely breaks to boost productivity ⏳✨</p>
        <button onClick={handleBack} className="user-forms-back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="user-forms-list-container">
        {forms && forms.length > 0 ? (
          <ul className="user-forms-list">
            {forms.map((form) => (
              <li key={form._id} className="user-forms-list-item">
                <div className="trip-info-row">
                  <div className="trip-info-item">
                    <span className="trip-info-icon">👷</span>
                    <span className="trip-info-label">Operator:</span> {form.tripDetails?.driverName || 'N/A'}
                  </div>
                  <div className="trip-info-item">
                    <span className="trip-info-icon">🆔</span>
                    <span className="trip-info-label">Emp ID:</span> {form.tripDetails?.operatorId || 'N/A'}
                  </div>
                  <div className="trip-info-item">
                    <span className="trip-info-icon">📅</span>
                    <span className="trip-info-label">Date:</span> {form.date || 'N/A'}
                  </div>
                   
                  <div className="trip-info-item">
                    <span className="trip-info-icon">🚛</span>
                    <span className="trip-info-label">Vehicle:</span> {form.tripDetails?.dumperNumber || 'N/A'}
                  </div>
                </div>

                <button
                  onClick={() => handleView(form._id)}
                  className="user-forms-view-button"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="user-forms-empty">No forms found.</p>
        )}
      </div>
    </div>
  );
};

export default AllForms;
