import React from 'react';
import { useSelector } from 'react-redux';

const checklistItems = [
  'पार्किंग ब्रेक', 'लाइट्स और हॉर्न', 'डैशबोर्ड',
  'लाइट्स वाइपर', 'साइंट बोर्ड', 'बैठक सीट/सुरक्षा बेल्ट',
  'हॉपर', 'स्टेप्स / हैंड रेल्स', 'इंजन आवाज',
  'साइरन', 'टायर / व्हील नट्स / रिम्स', 'स्टीयरिंग',
  'टूल बॉक्स', 'दरवाजा / शीशा / गेट्स', 'रेडिएटर',
  'बैटरी', 'फायर एक्स्टिंगुशर', 'मिरर'
];

const StartYourDaySection = ({
  onClose,
  tripDetails,
  setTripDetails,
  checkedValues,
  setCheckedValues,
  note,
  setNote,
  repairReported,
  setRepairReported,
  mechanicPin,
  setMechanicPin,
  driverPin,
  setDriverPin,
  handleSubmitStartForm,
}) => {
  const user = useSelector(state => state.auth.user);

  React.useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const formattedDate = `${dd}-${mm}-${yy}`;

    setTripDetails(prev => ({
      ...prev,
      tripDate: formattedDate,
      driverName: user?.name || '',
      operatorId: user?.employeeId || '',
    }));
  }, [user]);

  const handleTripChange = (e) => {
    const { id, value } = e.target;
    setTripDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleChange = (idx, value) => {
    setCheckedValues(prev => ({ ...prev, [idx]: value }));
  };

  const handleSelectAllOk = () => {
    const allOk = {};
    checklistItems.forEach((_, idx) => (allOk[idx] = 'OK'));
    setCheckedValues(allOk);
  };

  const handleClearAll = () => setCheckedValues({});

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

  const handleMicInput = (field, type = 'text') => {
    startListening((valueFn) =>
      setTripDetails(prev => ({
        ...prev,
        [field]: valueFn(prev[field] || '')
      }))
    , type);
  };

  const handleNoteMicInput = () => {
    startListening((valueFn) => setNote(prev => (prev ? prev + ' ' : '') + valueFn('')), 'text');
  };

  return (
    <div className="a4-form">
      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📝 प्रारंभिक प्री-स्टार्ट चेक लिस्ट</span>
        <button type="button" onClick={onClose} style={{ fontSize: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>⬅ Back</button>
      </div>

      <div className="form-header">
        <h2>त्रिवेणी सैनिक माइनिंग प्राइवेट लिमिटेड </h2>
        <h3>पकरी बरबडीह  कोल माइंस प्रोजेक्ट</h3>
        <h4>प्रारंभिक प्री-स्टार्ट चेक लिस्ट</h4>
      </div>

      <div className="checklist-buttons">
        <button type="button" onClick={handleSelectAllOk}>✅ Select All OK</button>
        <button type="button" onClick={handleClearAll}>❌ Clear All</button>
      </div>

      <div className="checklist-grid">
        {checklistItems.map((label, idx) => (
          <div key={idx} className="checklist-item">
            <span>{label}</span>
            <span>
              <label>
                <input type="radio" name={`check-${idx}`} checked={checkedValues[idx] === 'OK'} onChange={() => handleChange(idx, 'OK')} /> OK
              </label>
              <label>
                <input type="radio" name={`check-${idx}`} checked={checkedValues[idx] === 'Not OK'} onChange={() => handleChange(idx, 'Not OK')} /> Not OK
              </label>
            </span>
          </div>
        ))}
      </div>

      <div className="info-section">
        <label>अन्य सूचना:</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="यहां लिखें या माइक का उपयोग करें" />
        <button type="button" onClick={handleNoteMicInput}>🎤 माइक से बोले</button>
      </div>

      <div className="checkbox-line">
        <span>आवश्यक रिपेरिंग की सूचना सुपरवाइज़र को दी:</span>
        <label>
          <input type="radio" name="repairReported" value="yes" checked={repairReported === 'yes'} onChange={() => setRepairReported('yes')} /> हां
        </label>
        <label>
          <input type="radio" name="repairReported" value="no" checked={repairReported === 'no'} onChange={() => setRepairReported('no')} /> नहीं
        </label>

        <label>
          मैकेनिकल डिपार्टमेंट PIN:
          <input type="password" maxLength="6" inputMode="numeric" value={mechanicPin} onChange={(e) => setMechanicPin(e.target.value)} />
        </label>

        <label>
          ड्राइवर PIN:
          <input type="password" maxLength="6" inputMode="numeric" value={driverPin} onChange={(e) => setDriverPin(e.target.value)} />
        </label>
      </div>

      <div className="dumper-trip-report">
        <div className="section-title">डम्पर ट्रिप रिपोर्ट</div>
        <div className="input-grid">
          <div>
            <label htmlFor="tripDate">दिनांक:</label>
            <input id="tripDate" type="text" value={tripDetails.tripDate} onChange={handleTripChange} readOnly />
          </div>

          <div>
            <label htmlFor="shift">शिफ्ट:</label>
            <select id="shift" value={tripDetails.shift} onChange={handleTripChange}>
              <option value="">-- चुनें --</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label htmlFor="relay">रिले:</label>
            <input id="relay" type="text" value={tripDetails.relay} onChange={handleTripChange} />
            <button type="button" onClick={() => handleMicInput('relay', 'text')}>🎤</button>
          </div>

          <div>
            <label htmlFor="driverName">ड्राइवर का नाम:</label>
            <input id="driverName" type="text" value={tripDetails.driverName} onChange={handleTripChange} readOnly />
          </div>

          <div>
            <label htmlFor="dumperNumber">डंपर संख्या:</label>
            <input id="dumperNumber" type="text" value={tripDetails.dumperNumber} onChange={handleTripChange} />
            <button type="button" onClick={() => handleMicInput('dumperNumber', 'alphanumeric')}>🎤</button>
          </div>

          <div>
            <label htmlFor="operatorId">ऑपरेटर ID:</label>
            <input id="operatorId" type="text" value={tripDetails.operatorId} onChange={handleTripChange} readOnly />
          </div>

          <div>
            <label htmlFor="startHMR">स्टार्टिंग HMR:</label>
            <input id="startHMR" type="text" value={tripDetails.startHMR} onChange={handleTripChange} />
            <button type="button" onClick={() => handleMicInput('startHMR', 'number')}>🎤</button>
          </div>

          <div>
            <label htmlFor="startKM">स्टार्टिंग किलोमीटर:</label>
            <input id="startKM" type="text" value={tripDetails.startKM} onChange={handleTripChange} />
            <button type="button" onClick={() => handleMicInput('startKM', 'number')}>🎤</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={handleSubmitStartForm} style={{ padding: '10px 20px', fontSize: '16px' }}>💾 फॉर्म सेव करें</button>
      </div>
    </div>
  );
};

export default StartYourDaySection;
