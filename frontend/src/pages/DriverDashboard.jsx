import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 
import FullVehicleReportView from '../components/FullVehicleReportView';
import StartYourDaySection from '../components/StartYourDaySection';
import { getSocket } from '../sockets/socket';
import { BASE_URL } from '../config';

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
   

  const [formId, setFormId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTripRow, setNewTripRow] = useState({ startTime: '', machine: '', material: '', site: '' });
  const [tripDetails, setTripDetails] = useState({});
  const [checkedValues, setCheckedValues] = useState({});
  const [note, setNote] = useState('');
  const [repairReported, setRepairReported] = useState('');
  const [mechanicPin, setMechanicPin] = useState('');
  const [driverPin, setDriverPin] = useState('');
  const [breakdownNote, setBreakdownNote] = useState('');
  const [footerPins, setFooterPins] = useState({ driver: '', supervisor: '', incharge: '' });
  const [showWorkList, setShowWorkList] = useState(false);
  const gpsIntervalRef = useRef(null);

  const worksiteOptions = [
    'माइंस से OB डंप',
    'माइंस से COAL डंप',
    'माइंस से क्रशर',
    'COAL स्टॉक से क्रशर',
    'क्रशर COAL शिपिंग',
    'बैलिंग प्लांट',
    'अन्य स्थल',
  ];

  const fetchTodayForm = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/form/today/${user.id}`);
      setFormId(data._id);
      setFormData(data);
    } catch (err) {
      setFormId(null);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStartForm = async () => {
    try {
      const payload = {
        userId: user?.id,
        tripDetails,
        checklist: checkedValues,
        notes: note,
        repairReported,
        mechanicPin,
        driverPin,
      };

      await axios.post(`${BASE_URL}/api/form/start`, payload);

      alert('Form saved successfully!');
      fetchTodayForm();
    } catch (error) {
      console.error('Save start form failed:', error);
      alert('Failed to save start form');
    }
  };

  const handleSubmitBreakdown = async () => {
    if (!formId) return alert("Form not found");

    try {
      await axios.put(`${BASE_URL}/api/form/${formId}/breakdown`, {
        breakdownNote,
        footerPins,
      });

      alert("ब्रेकडाउन सफलतापूर्वक सेव हुआ!");
      await fetchTodayForm();
    } catch (error) {
      console.error("❌ Breakdown submit failed:", error);
      alert("ब्रेकडाउन सेव करने में त्रुटि हुई।");
    }
  };

  const handleStartTripDirect = async () => {
    const row = newTripRow;
    if (!row.startTime || !row.machine || !row.material || !row.site) {
      return alert('Please fill all fields');
    }

    const [hh, mm] = row.startTime.split(':');
    const startTimeDate = new Date();
    startTimeDate.setHours(Number(hh), Number(mm), 0, 0);

    const newRow = {
      startTime: startTimeDate,
      machine: row.machine,
      material: row.material,
      site: row.site,
      status: 'running',
      path: [],
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/api/form/${formId}/addTrip`, newRow);
      const tripId = data.tripRow._id;
      const socket = getSocket();

      gpsIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            socket.emit('locationUpdate', {
              userId: user.id,
              tripId,
              location: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                time: new Date(),
              },
            });
          },
          () => {},
          { enableHighAccuracy: true }
        );
      }, 5000);

      setNewTripRow({ startTime: '', machine: '', material: '', site: '' });
      fetchTodayForm();
    } catch (err) {
      console.error('Failed to start trip:', err);
      alert('Error starting trip');
    }
  };

  const handleEndTrip = async (tripRowId) => {
    try {
      await axios.put(`${BASE_URL}/api/form/${formId}/trip/${tripRowId}/end`);
      if (gpsIntervalRef.current) {
        clearInterval(gpsIntervalRef.current);
        gpsIntervalRef.current = null;
      }
      fetchTodayForm();
    } catch (err) {
      console.error('Error ending trip:', err);
      alert('Failed to end trip');
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchTodayForm();
  }, [user.id]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('liveLocation', ({ userId: u, tripId, location }) => {
      if (u === user.id) {
        // dispatch(updateLiveTripPath({ tripId, location }));
        // dispatch(updateSelectedTripPath({ tripId, location }));
      }
    });
    return () => socket.off('liveLocation');
  }, [user.id]);

  const handleGetWorkList = () => {
    navigate(`/driver/${user.id}/forms`);
  };

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        'Loading…'
      ) : (
        <>
          <h2>Welcome, {user.name}</h2>
          <p style={{ marginBottom: 20, color: '#555', fontStyle: 'italic' }}>
            Work carefully, your life is precious.
          </p>

          <div style={{ marginBottom: 30 }}>
            <button style={{ marginRight: 10 }} onClick={handleGetWorkList}>
              📋 Get Your Work List
            </button>
            <button onClick={() => setShowWorkList(false)}>
              {formId ? '🛠 Update Form' : '🚀 Start Your Day'}
            </button>
          </div>

          {showWorkList ? (
            <p style={{ color: '#777' }}>[🛠 Work list section coming soon]</p>
          ) : formId ? (
            <FullVehicleReportView
              form={formData}
              readOnly={false}
              newTripRow={newTripRow}
              updateNewRow={(key, value) => setNewTripRow({ ...newTripRow, [key]: value })}
              worksiteOptions={worksiteOptions}
              startTripDirect={handleStartTripDirect}
              endTripRow={handleEndTrip}
              breakdownNote={breakdownNote}
              setBreakdownNote={setBreakdownNote}
              footerPins={footerPins}
              setFooterPins={setFooterPins}
              handleSubmitBreakdown={handleSubmitBreakdown}
            />
          ) : (
            <StartYourDaySection
              tripDetails={tripDetails}
              setTripDetails={setTripDetails}
              checkedValues={checkedValues}
              setCheckedValues={setCheckedValues}
              note={note}
              setNote={setNote}
              repairReported={repairReported}
              setRepairReported={setRepairReported}
              mechanicPin={mechanicPin}
              setMechanicPin={setMechanicPin}
              driverPin={driverPin}
              setDriverPin={setDriverPin}
              handleSubmitStartForm={handleSubmitStartForm}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DriverDashboard;
