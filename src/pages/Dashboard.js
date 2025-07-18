

import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartJsTooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartJsTooltip, Legend);

function Dashboard() {
  const [summary, setSummary] = useState({ total_users: 0, total_loans: 0, total_goals: 0, active_users: 0 });
  const [monthly, setMonthly] = useState([]);
  const [activeVsInactive, setActiveVsInactive] = useState({ active_users: 0, inactive_users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("https://aitechnotech.in/ryze/Admin/dashboard/overview")
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || {});
        setMonthly(data.monthly_data || []);
        setActiveVsInactive(data.active_vs_inactive || {});
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  // Prepare chart data for Chart.js
  const months = monthly.map(m => m.month.slice(0, 3));
  const userData = monthly.map(m => m.users);
  const loanData = monthly.map(m => m.loans);
  const goalData = monthly.map(m => m.goals);

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Users',
        data: userData,
        backgroundColor: '#007bff',
        borderRadius: 4,
        maxBarThickness: 24,
      },
      {
        label: 'Loans',
        data: loanData,
        backgroundColor: '#28a745',
        borderRadius: 4,
        maxBarThickness: 24,
      },
      {
        label: 'Goals',
        data: goalData,
        backgroundColor: '#ffc107',
        borderRadius: 4,
        maxBarThickness: 24,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          font: { size: 14 },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 13 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { font: { size: 13 } }
      }
    },
    maintainAspectRatio: false,
  };


  // Chart.js Doughnut data for Active vs Inactive Users
  const pieData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        data: [activeVsInactive.active_users || 0, activeVsInactive.inactive_users || 0],
        backgroundColor: ['#007bff', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percent}%)`;
          }
        }
      },
    },
    cutout: '60%',
    maintainAspectRatio: false,
  };

  return (
    <>
      {error && <div className="alert alert-danger text-center mb-3">{error}</div>}
      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-bold text-muted mb-1">Total Users</div>
                  <div className="h3 mb-1">{summary.total_users}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-bold text-muted mb-1">Total Loans</div>
                  <div className="h3 mb-1">{summary.total_loans}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-bold text-muted mb-1">Total Goals</div>
                  <div className="h3 mb-1">{summary.total_goals}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-bold text-muted mb-1">Active Users</div>
                  <div className="h3 mb-1">{summary.active_users}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Monthly Users, Loans, Goals</h5>
                  <div style={{ width: "100%", minHeight: 320, height: 'auto' }}>
                    <Bar data={barData} options={barOptions} height={320} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Active vs Inactive Users</h5>
                  <div style={{ width: "100%", height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Doughnut data={pieData} options={pieOptions} height={220} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;
