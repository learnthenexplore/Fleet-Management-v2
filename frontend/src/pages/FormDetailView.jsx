// File: src/pages/FormDetailView.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import './StartForm.css'; // Reusing the same CSS for layout/styling

const checklistLabels = [
  'पार्किंग ब्रेक', 'लाइट्स और हॉर्न', 'डैशबोर्ड',
  'लाइट्स वाइपर', 'साइंट बोर्ड', 'बैठक सीट/सुरक्षा बेल्ट',
  'हॉपर', 'स्टेप्स / हैंड रेल्स', 'इंजन आवाज',
  'साइरन', 'टायर / व्हील नट्स / रिम्स', 'स्टीयरिंग',
  'टूल बॉक्स', 'दरवाजा / शीशा / गेट्स', 'रेडिएटर',
  'बैटरी', 'फायर एक्स्टिंगुशर', 'मिरर',
];

const FormDetailView = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/form/${formId}`);
        setForm(res.data);
      } catch (err) {
        console.error('Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const convertToIST = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  if (loading) {
    return <p className="text-center p-6">Loading form details...</p>;
  }

  if (!form) {
    return <p className="text-center text-red-600 p-6">Form not found.</p>;
  }

  const { tripDetails = {}, checklist = {}, notes = '', repairReported, mechanicPin, driverPin, tripRows = [], breakdownNote = '', footerPins = {} } = form;

  return (
    <div className="form-wrapper">
      <div className="a4-form">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          ← Back
        </button>

        <div className="form-header">
          <h2>थ्रिवेणी सैनिक़ माइंस प्राइवेट लिमिटेड</h2>
          <h3>पचमी बोकारो कोल माइंस प्रोजेक्ट</h3>
          <h4>प्रारंभिक प्री-स्टार्ट चेक लिस्ट (Read-Only)</h4>
        </div>

        {/* Checklist */}
        <div className="checklist-grid">
          {checklistLabels.map((label, idx) => (
            <div key={idx} className="checklist-item">
              <span>{label}</span>
              <span>
                <label>
                  <input type="radio" checked={checklist?.[idx] === 'OK'} readOnly /> OK
                </label>
                <label>
                  <input type="radio" checked={checklist?.[idx] === 'Not OK'} readOnly /> Not OK
                </label>
              </span>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="info-section">
          <label>अन्य सूचना:</label>
          <textarea value={notes} readOnly />
        </div>

        {/* Repair Report */}
        <div className="checkbox-line">
          <span>आवश्यक रिपेरिंग की सूचना सुपरवाइज़र को दी:</span>
          <label>
            <input type="radio" checked={repairReported === 'yes'} readOnly /> हां
          </label>
          <label>
            <input type="radio" checked={repairReported === 'no'} readOnly /> नहीं
          </label>
          <label>
            मैकेनिकल डिपार्टमेंट PIN:
            <input type="password" value={mechanicPin} readOnly />
          </label>
          <label>
            ड्राइवर PIN:
            <input type="password" value={driverPin} readOnly />
          </label>
        </div>

        {/* Trip Details */}
        <div className="dumper-trip-report">
          <div className="section-title">🚛 डम्पर ट्रिप रिपोर्ट</div>
          <div className="input-grid">
            <div><label>दिनांक:</label><p>{tripDetails.tripDate}</p></div>
            <div><label>शिफ्ट:</label><p>{tripDetails.shift}</p></div>
            <div><label>रिले:</label><p>{tripDetails.relay}</p></div>
            <div><label>ड्राइवर का नाम:</label><p>{tripDetails.driverName}</p></div>
            <div><label>डंपर संख्या:</label><p>{tripDetails.dumperNumber}</p></div>
            <div><label>ऑपरेटर ID:</label><p>{tripDetails.operatorId}</p></div>
            <div><label>स्टार्टिंग HMR:</label><p>{tripDetails.startHMR}</p></div>
            <div><label>क्लोजिंग HMR:</label><p>{tripDetails.closeHMR}</p></div>
            <div><label>स्टार्टिंग किलोमीटर:</label><p>{tripDetails.startKM}</p></div>
            <div><label>क्लोजिंग किलोमीटर:</label><p>{tripDetails.closeKM}</p></div>
          </div>
        </div>

        {/* Trip Table */}
        <table className="details-table">
          <thead>
            <tr>
              <th>टिपर संख्या</th>
              <th>समय</th>
              <th>मशीन नंबर</th>
              <th>माल</th>
              <th>कार्य स्थल</th>
              <th>कार्य</th>
            </tr>
          </thead>
          <tbody>
            {tripRows.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{convertToIST(row.startTime)}</td>
                <td>{row.machine}</td>
                <td>{row.material}</td>
                <td>{row.site}</td>
                <td>{row.status === 'completed' ? '✅ Done' : '⏳ In Progress'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Breakdown Section */}
        <div className="footer-section">
          <label>ब्रेकडाउन रिपोर्ट व टिप्पणियाँ:</label>
          <textarea value={breakdownNote} readOnly />

          <div className="pin-grid">
            <label>
              ड्राइवर Pin:
              <input type="password" value={footerPins.driver || ''} readOnly />
            </label>
            <label>
              शिफ्ट सुपरवाइजर Pin:
              <input type="password" value={footerPins.supervisor || ''} readOnly />
            </label>
            <label>
              शिफ्ट इन्चार्ज Pin:
              <input type="password" value={footerPins.incharge || ''} readOnly />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDetailView;
