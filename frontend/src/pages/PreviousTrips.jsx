import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './LiveTrips.css';
import LiveMap from '../components/LiveMap';

export default function PreviousTrips() {
  const { forms, loading, error } = useSelector((state) => state.form);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    if (forms.length > 0 && forms[0].tripRows.length > 0) {
      setSelectedTrip({ ...forms[0].tripRows[0], form: forms[0] });
    }
  }, [forms]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!forms.length) return <p>No trips available.</p>;

  return (
    <div className="container">
      {/* Left Trip List */}
      <div className="table-pane">
        <h3 className="pane-title">🟦 Previous Trips</h3>
        <div className="trip-list">
          {forms.map((form, formIdx) =>
            form.tripRows.map((trip, tripIdx) => (
              <div key={`${formIdx}-${tripIdx}`} className="trip-card">
                <div className="trip-info">
                  <p>📅 Date: {form.date}</p>
                  <p>
                    🕒 Time:{' '}
                    {new Date(trip.startTime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      timeZone: 'Asia/Kolkata',
                    })}
                  </p>
                  <p>👷 Operator: {form.tripDetails?.driverName || 'N/A'}</p>
                  <p>🚛 Vehicle: {form.tripDetails?.dumperNumber || 'N/A'}</p>
                  <p>🏗️ Material: {trip.material}</p>
                </div>
                <button
                  className="view-btn"
                  onClick={() => setSelectedTrip({ ...trip, form })}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Trip Details */}
      <div className="detail-pane">
        <h2 className="detail-title">Detail View of Trip</h2>

        {selectedTrip && (
          <>
            <div className="info-grid">
              <div className="info-block single">
                {[
                  ['👷 Operator:', selectedTrip.form.tripDetails?.driverName],
                  ['📅 Date:', selectedTrip.form.date],
                  ['🏗️ Material:', selectedTrip.material],
                  ['🛠️ Machine:', selectedTrip.machine],
                  ['🚛 Vehicle No.:', selectedTrip.form.tripDetails?.dumperNumber],
                  ['🕒 Start Time:', new Date(selectedTrip.startTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
                  })],
                  ['🕒 End Time:', new Date(selectedTrip.endTime).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
                  })],
                  ['✅ Status:', selectedTrip.status],
                ].map(([label, value], i) => (
                  <div className="info-item-button" key={i}>
                    <span className="inline-text">{label} {value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="map-container">
              {selectedTrip.path?.length > 0 ? (
                <LiveMap path={selectedTrip.path} />
              ) : (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/India_location_map.svg/1280px-India_location_map.svg.png"
                  alt="Map placeholder"
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
