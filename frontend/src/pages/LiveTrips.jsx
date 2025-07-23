import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './LiveTrips.css';
import LiveMap from '../components/LiveMap';

export default function LiveTrips() {
  const { forms, loading, error } = useSelector((state) => state.form);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Extract all running trips from forms
  const runningTrips = forms
    .flatMap((form) =>
      form.tripRows
        .filter((trip) => trip.status === 'running')
        .map((trip) => ({ ...trip, form }))
    );

  // Set default selected running trip
  useEffect(() => {
    if (runningTrips.length > 0) {
      setSelectedTrip(runningTrips[0]);
    }
  }, [forms]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!runningTrips.length) return <p>No live trips found.</p>;

  const formatTime = (isoTime) =>
    new Date(isoTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

  return (
    <div className="container">
      {/* Left Table */}
      <div className="table-pane">
        <h3 className="pane-title">🟦 Live Trips</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>Operator</th>
              <th>Vehicle</th>
              <th>Material</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {runningTrips.map((trip, idx) => (
              <tr key={idx}>
                <td>{trip.form.date}</td>
                <td>{formatTime(trip.startTime)}</td>
                <td>{trip.form.tripDetails?.driverName || 'N/A'}</td>
                <td>{trip.form.tripDetails?.dumperNumber || 'N/A'}</td>
                <td>{trip.material}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Detail View */}
      <div className="detail-pane">
        <h2 className="detail-title">Detail View of Trip</h2>

        {selectedTrip && (
          <>
            <div className="info-grid">
              <div className="info-block">
                <p>Operator: {selectedTrip.form.tripDetails?.driverName}</p>
                <p>Date: {selectedTrip.form.date}</p>
                <p>Material: {selectedTrip.material}</p>
                <p>Machine: {selectedTrip.machine}</p>
              </div>

              <div className="info-block">
                <p>Vehicle No.: {selectedTrip.form.tripDetails?.dumperNumber}</p>
                <p>Start Time: {formatTime(selectedTrip.startTime)}</p>
                <p>End Time: {selectedTrip.endTime ? formatTime(selectedTrip.endTime) : 'Ongoing'}</p>
                <p>Status: {selectedTrip.status}</p>
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
