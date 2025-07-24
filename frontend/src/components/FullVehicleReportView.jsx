import React, { useState } from 'react';
import './FullVehicleReportView.css';
import axios from 'axios';
import { BASE_URL } from '../config';
import './FullVehicleReportView.css';
const checklistLabels = [
  'पार्किंग ब्रेक', 'लाइट्स और हॉर्न', 'डैशबोर्ड',
  'लाइट्स वाइपर', 'साइंट बोर्ड', 'बैठक सीट/सुरक्षा बेल्ट',
  'हॉपर', 'स्टेप्स / हैंड रेल्स', 'इंजन आवाज',
  'साइरन', 'टायर / व्हील नट्स / रिम्स', 'स्टीयरिंग',
  'टूल बॉक्स', 'दरवाजा / शीशा / गेट्स', 'रेडिएटर',
  'बैटरी', 'फायर एक्स्टिंगुशर', 'मिरर',
];

const FullVehicleReportView = ({
  readOnly = false,
  newTripRow = {},
  updateNewRow = () => {},
  startTripDirect = () => {},
  endTripRow = () => {},
  worksiteOptions = [],
  breakdownNote = '',
  setBreakdownNote = () => {},
  footerPins = {},
  setFooterPins = () => {},
  handleSubmitBreakdown = () => {},
  form = {},
}) => {
  const {
    _id: formId,
    tripDetails = {},
    checklist = {},
    notes = '',
    repairReported = '',
    mechanicPin = '',
    driverPin = '',
    tripRows = [],
    breakdownNote: savedBreakdownNote = '',
    footerPins: savedFooterPins = {},
  } = form;

  const [closeKM, setCloseKM] = useState(tripDetails.closeKM || '');
  const [closeHMR, setCloseHMR] = useState(tripDetails.closeHMR || '');
  const [saving, setSaving] = useState(false);

  // --- MIC INPUT LOGIC ---
  const startListening = (callback, type = 'text') => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      if (type === 'number') {
        transcript = transcript.replace(/[^\d]/g, '');
      } else if (type === 'alphanumeric') {
        transcript = transcript.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      }
      callback(prev => (prev ? prev + ' ' : '') + transcript);
    };

    recognition.onerror = (event) => alert('माइक से इनपुट नहीं हो पाया: ' + event.error);
    recognition.start();
  };

  const handleBreakdownMicInput = () => {
    startListening((valueFn) => setBreakdownNote(prev => (prev ? prev + ' ' : '') + valueFn('')), 'text');
  };

  // --- END MIC LOGIC ---

  const convertToIST = (utcTime) => {
    const date = new Date(utcTime);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const handleSaveCloseValues = async () => {
    const startKM = parseFloat(tripDetails.startKM || '0');
    const startHMR = parseFloat(tripDetails.startHMR || '0');
    const enteredCloseKM = parseFloat(closeKM || '0');
    const enteredCloseHMR = parseFloat(closeHMR || '0');
    if (!closeKM || !closeHMR) {
      alert('क्लोजिंग HMR और क्लोजिंग किलोमीटर दोनों भरें');
      return;
    }
    if (enteredCloseKM <= startKM || enteredCloseHMR <= startHMR) {
      alert('क्लोजिंग HMR और क्लोजिंग किलोमीटर स्टार्टिंग से अधिक होना चाहिए');
      return;
    }
    try {
      setSaving(true);
      await axios.patch(`http://localhost:5000/api/form/vehicle-report/${formId}/close-values`, {
        closeKM,
        closeHMR,
      });
      alert('क्लोजिंग वैल्यू सफलतापूर्वक सेव हो गई');
    } catch (err) {
      console.error(err);
      alert('सेव करने में त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="a4-form">
        <div className="form-header section-card">
          <h2>त्रिवेणी सैनिक माइनिंग प्राइवेट लिमिटेड</h2>
          <h3>पकरी बरबडीह  कोल माइंस प्रोजेक्ट</h3>
          <h4>प्रारंभिक प्री-स्टार्ट चेक लिस्ट</h4>
        </div>

        <div className="section-card">
          <h4>प्री-स्टार्ट चेकलिस्ट</h4>
          <div className="checklist-grid">
            {checklistLabels.map((label, idx) => (
              <div key={idx} className="checklist-item">
                <span>{label}</span>
                <span>
                  <label>
                    <input type="radio" checked={checklist?.[idx] === 'OK'} readOnly />
                    <span className="ok-label">✔️ OK</span>
                  </label>
                  <label style={{ marginLeft: 12 }}>
                    <input type="radio" checked={checklist?.[idx] === 'Not OK'} readOnly />
                    <span className="notok-label">❌ Not OK</span>
                  </label>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card info-section">
          <label>अन्य सूचना:</label>
          <textarea value={notes} readOnly />
        </div>

        <div className="section-card checkbox-line">
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

        <div className="section-card dumper-trip-report">
          <div className="section-title">🚛 डम्पर ट्रिप रिपोर्ट</div>
          <div className="input-grid">
            <div><label>दिनांक:</label><p>{tripDetails.tripDate}</p></div>
            <div><label>शिफ्ट:</label><p>{tripDetails.shift}</p></div>
            <div><label>रिले:</label><p>{tripDetails.relay}</p></div>
            <div><label>ड्राइवर का नाम:</label><p>{tripDetails.driverName}</p></div>
            <div><label>डंपर संख्या:</label><p>{tripDetails.dumperNumber}</p></div>
            <div><label>ऑपरेटर ID:</label><p>{tripDetails.operatorId}</p></div>
            <div><label>स्टार्टिंग HMR:</label><p>{tripDetails.startHMR}</p></div>

            <div>
              <label>क्लोजिंग HMR:</label>
              {readOnly ? (
                <p>{tripDetails.closeHMR}</p>
              ) : (
                <>
                  <input
                    type="number"
                    value={closeHMR}
                    onChange={(e) => setCloseHMR(e.target.value)}
                    placeholder="HMR"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      startListening(
                        (valueFn) =>
                          setCloseHMR((prev) => (prev ? prev + ' ' : '') + valueFn('')),
                        'number'
                      )
                    }
                    className="mic-btn"
                  >
                    🎤
                  </button>
                </>
              )}
            </div>

            <div><label>स्टार्टिंग किलोमीटर:</label><p>{tripDetails.startKM}</p></div>

            <div>
              <label>क्लोजिंग किलोमीटर:</label>
              {readOnly ? (
                <p>{tripDetails.closeKM}</p>
              ) : (
                <>
                  <input
                    type="number"
                    value={closeKM}
                    onChange={(e) => setCloseKM(e.target.value)}
                    placeholder="KM"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      startListening(
                        (valueFn) =>
                          setCloseKM((prev) => (prev ? prev + ' ' : '') + valueFn('')),
                        'number'
                      )
                    }
                    className="mic-btn"
                  >
                    🎤
                  </button>
                </>
              )}
            </div>
          </div>

          {!readOnly && (
            <button className="submit-btn" onClick={handleSaveCloseValues} disabled={saving}>
              {saving ? 'सेव हो रहा है...' : ' सेव क्लोजिंग वैल्यू'}
            </button>
          )}
        </div>

        <div className="section-card">
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
                  <td>
                    {row.status === 'completed' ? '✅ Done' : !readOnly && (
                      <button className="end-btn" onClick={() => endTripRow(row._id)}>⏹ End</button>
                    )}
                  </td>
                </tr>
              ))}

              {!readOnly && (tripRows.length === 0 || tripRows.every((r) => r.status === 'completed')) && (
                <tr>
                  <td>{tripRows.length + 1}</td>
                  <td>
                    <input
                      value={newTripRow.startTime}
                      onChange={(e) => updateNewRow('startTime', e.target.value)}
                      placeholder="HH:MM"
                    />
                    <button
                      className="set-btn"
                      onClick={() => {
                        const now = new Date().toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        updateNewRow('startTime', now);
                      }}
                    >Set</button>
                  </td>
                  <td>
                    <input
                      value={newTripRow.machine}
                      onChange={(e) => updateNewRow('machine', e.target.value)}
                    />
                  </td>
                  <td>
                    <label>
                      <input
                        type="radio"
                        name="material"
                        value="OB"
                        checked={newTripRow.material === 'OB'}
                        onChange={() => updateNewRow('material', 'OB')}
                      /> OB
                    </label>
                    <label style={{ marginLeft: 10 }}>
                      <input
                        type="radio"
                        name="material"
                        value="Coal"
                        checked={newTripRow.material === 'Coal'}
                        onChange={() => updateNewRow('material', 'Coal')}
                      /> Coal
                    </label>
                  </td>
                  <td>
                    <select
                      value={newTripRow.site}
                      onChange={(e) => updateNewRow('site', e.target.value)}
                    >
                      <option value="">-- कार्य स्थल चुनें --</option>
                      {worksiteOptions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="start-btn" onClick={startTripDirect}>🚀 Save & Start</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="footer-section section-card">
          <label>ब्रेकडाउन रिपोर्ट व टिप्पणियाँ:</label>
          <textarea
            value={breakdownNote || savedBreakdownNote}
            onChange={(e) => setBreakdownNote(e.target.value)}
            placeholder="यहाँ विवरण लिखें या माइक का उपयोग करें"
          />
          <button type="button" className="mic-btn" onClick={handleBreakdownMicInput} style={{ marginTop: 8 }}>
            🎤 माइक से बोले
          </button>

          <div className="pin-grid">
            <label>
              ड्राइवर Pin:
              <input
                type="password"
                maxLength="6"
                value={footerPins.driver || savedFooterPins.driver || ''}
                onChange={(e) => setFooterPins({ ...footerPins, driver: e.target.value })}
              />
            </label>
            <label>
              शिफ्ट सुपरवाइजर Pin:
              <input
                type="password"
                maxLength="6"
                value={footerPins.supervisor || savedFooterPins.supervisor || ''}
                onChange={(e) => setFooterPins({ ...footerPins, supervisor: e.target.value })}
              />
            </label>
            <label>
              शिफ्ट इन्चार्ज Pin:
              <input
                type="password"
                maxLength="6"
                value={footerPins.incharge || savedFooterPins.incharge || ''}
                onChange={(e) => setFooterPins({ ...footerPins, incharge: e.target.value })}
              />
            </label>
          </div>

          <button className="submit-btn" onClick={handleSubmitBreakdown}>सबमिट करें</button>
        </div>
      </div>
    </div>
  );
};

export default FullVehicleReportView;