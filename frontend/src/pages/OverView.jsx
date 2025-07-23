import React, { useEffect, useMemo } from 'react';
import './OverView.css';
import { useDispatch, useSelector } from 'react-redux';
import { setForms, setLoading, setError } from '../redux/slices/formSlice';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartLegend);

const OverView = () => {
  const dispatch = useDispatch();
  const { forms } = useSelector((state) => state.form);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(`${BASE_URL}/api/form/all`);
        dispatch(setForms(response.data.forms));
        console.log('Fetched forms:', response.data.forms);
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchForms();
  }, [dispatch]);
  const navigate = useNavigate();
  const handelOnClickLive = () => {
          navigate("/manager/livetrips");
  };
  const handelOnClickCompleted = () => {
          navigate("/manager/previoustrips");
  };

  const stats = useMemo(() => {
    let live = 0, completed = 0, total = 0, coal = 0, ob = 0;

    forms.forEach(form => {
      form.tripRows?.forEach(row => {
        total += 1;
        if (row.status === 'running') live += 1;
        else if (row.status === 'completed') completed += 1;

        if (row.material?.toLowerCase() === 'coal') coal += 1;
        else if (row.material?.toLowerCase() === 'ob') ob += 1;
      });
    });

    return { live, completed, total, coal, ob };
  }, [forms]);

  const lineData = [
    { time: '6 AM', coal: 0, ob: 0, total: 0, coalAvg: 0, obAvg: 0, totalAvg: 0 },
    { time: '7 AM', coal: 1, ob: 1, total: 2, coalAvg: 1, obAvg: 0, totalAvg: 1 },
    { time: '8 AM', coal: 2, ob: 1, total: 3, coalAvg: 1, obAvg: 1, totalAvg: 2 },
    { time: '9 AM', coal: 4, ob: 2, total: 6, coalAvg: 2, obAvg: 1, totalAvg: 3 },
    { time: '10 AM', coal: 5, ob: 3, total: 8, coalAvg: 3, obAvg: 2, totalAvg: 5 },
    { time: '11 AM', coal: 7, ob: 4, total: 11, coalAvg: 5, obAvg: 3, totalAvg: 8 },
    { time: '12 PM', coal: 8, ob: 6, total: 14, coalAvg: 6, obAvg: 4, totalAvg: 10 },
    { time: '1 PM', coal: 9, ob: 7, total: 16, coalAvg: 6, obAvg: 4, totalAvg: 10 },
    { time: '2 PM', coal: 11, ob: 8, total: 19, coalAvg: 7, obAvg: 5, totalAvg: 12 },
    { time: '3 PM', coal: 13, ob: 8, total: 21, coalAvg: 8, obAvg: 5, totalAvg: 13 },
    { time: '4 PM', coal: 14, ob: 9, total: 23, coalAvg: 9, obAvg: 5, totalAvg: 14 },
    { time: '5 PM', coal: 15, ob: 10, total: 25, coalAvg: 9, obAvg: 6, totalAvg: 15 },
  ];

  const barChartData = {
    labels: ['Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21', 'Jul 22'],
    datasets: [
      {
        label: 'Coal',
        data: [60, 72, 80, 65, 70, 68, stats.coal],
        backgroundColor: 'green',
      },
      {
        label: 'OB',
        data: [55, 65, 78, 60, 66, 63, stats.ob],
        backgroundColor: 'brown',
      },
      {
        label: 'Total',
        data: [115, 137, 158, 125, 136, 131, stats.total],
        backgroundColor: '#007bff',
      },
    ],
  };

 const barChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 150,
      ticks: {
        stepSize: 10, // 👈 Shows 0, 10, 20, ..., 150
      },
      title: {
        display: true,
        text: 'Number of Trips',
      },
    },
  },
};

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Today's Production Overview</h2>
        <div className="welcome-text">
          Welcome, <strong>Himanshu Kumar</strong>
        </div>
      </div>

      <div className="stats-cards">
        <div className="card" onClick={handelOnClickLive}><p>Live Trips</p><h3>{stats.live}</h3></div>
        <div className="card " onClick={handelOnClickCompleted}><p>Completed Trips</p><h3>{stats.completed}</h3></div>
        <div className="card"><p>Total Trips</p><h3>{stats.total}</h3></div>
        <div className="card"><p>Coal Production </p><h3>{stats.coal*30} mt</h3></div>
        <div className="card"><p>OB Production</p><h3>{stats.ob*14} BCM</h3></div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-box">
          <h4>Today's vs Last 30 Days Trend</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="coal" name="Today's Coal" stroke="green" strokeWidth={2} />
              <Line type="monotone" dataKey="ob" name="Today's OB" stroke="brown" strokeWidth={2} />
              <Line type="monotone" dataKey="total" name="Today's Total" stroke="#007bff" strokeWidth={2} />
              <Line type="monotone" dataKey="coalAvg" name="Avg Coal" stroke="green" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="obAvg" name="Avg OB" stroke="brown" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="totalAvg" name="Avg Total" stroke="#007bff" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4 className="bar-title">Coal vs OB vs Total - Last 7 Days</h4>
          <Bar data={barChartData} options={barChartOptions} height={300} width={350} />
        </div>
      </div>
    </div>
  );
};

export default OverView;
