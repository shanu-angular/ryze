
import React, { useEffect, useState } from "react";

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

  // Prepare chart data to align with API months and add tooltip state
  const months = monthly.map(m => m.month.slice(0, 3));
  const userData = monthly.map(m => m.users);
  const loanData = monthly.map(m => m.loans);
  const goalData = monthly.map(m => m.goals);
  const maxBar = Math.max(1, ...userData, ...loanData, ...goalData);

  // Tooltip state
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, month: '', users: 0, loans: 0, goals: 0 });

  // Tooltip for pie chart
  const [pieTooltip, setPieTooltip] = useState({ show: false, x: 0, y: 0, label: '', value: 0, percent: 0, color: '' });

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
                  <div style={{ width: "100%", height: 320, padding: 16 }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "flex-end", height: 220 }}>
                      {months.map((month, i) => (
                        <div
                          key={month + i}
                          style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: 4 }}>
                            <div
                              style={{
                                width: 18,
                                height: `${(userData[i] / maxBar) * 180}px`,
                                background: "#007bff",
                                borderRadius: 4,
                                cursor: "pointer"
                              }}
                              onMouseEnter={e => {
                                const rect = e.target.getBoundingClientRect();
                                setTooltip({
                                  show: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                  month,
                                  users: userData[i],
                                  loans: loanData[i],
                                  goals: goalData[i]
                                });
                              }}
                              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
                            ></div>
                            <div
                              style={{
                                width: 18,
                                height: `${(loanData[i] / maxBar) * 180}px`,
                                background: "#28a745",
                                borderRadius: 4,
                                cursor: "pointer"
                              }}
                              onMouseEnter={e => {
                                const rect = e.target.getBoundingClientRect();
                                setTooltip({
                                  show: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                  month,
                                  users: userData[i],
                                  loans: loanData[i],
                                  goals: goalData[i]
                                });
                              }}
                              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
                            ></div>
                            <div
                              style={{
                                width: 18,
                                height: `${(goalData[i] / maxBar) * 180}px`,
                                background: "#ffc107",
                                borderRadius: 4,
                                cursor: "pointer"
                              }}
                              onMouseEnter={e => {
                                const rect = e.target.getBoundingClientRect();
                                setTooltip({
                                  show: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                  month,
                                  users: userData[i],
                                  loans: loanData[i],
                                  goals: goalData[i]
                                });
                              }}
                              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
                            ></div>
                          </div>
                          <div style={{ fontSize: 14, marginTop: 8 }}>{month}</div>
                        </div>
                      ))}
                      {/* Tooltip */}
                      {tooltip.show && (
                        <div
                          style={{
                            position: "fixed",
                            left: tooltip.x + 10,
                            top: tooltip.y - 60,
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: 6,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            padding: "10px 16px",
                            zIndex: 9999,
                            pointerEvents: "none",
                            minWidth: 120
                          }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltip.month}</div>
                          <div style={{ color: "#007bff" }}>Users: {tooltip.users}</div>
                          <div style={{ color: "#28a745" }}>Loans: {tooltip.loans}</div>
                          <div style={{ color: "#ffc107" }}>Goals: {tooltip.goals}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 16, height: 16, background: "#007bff", borderRadius: 2, display: "inline-block" }}></span> Users</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 16, height: 16, background: "#28a745", borderRadius: 2, display: "inline-block" }}></span> Loans</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 16, height: 16, background: "#ffc107", borderRadius: 2, display: "inline-block" }}></span> Goals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Active vs Inactive Users</h5>
                  <div style={{ width: "100%", height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <svg width="180" height="180" viewBox="0 0 32 32" style={{ cursor: 'pointer' }}>
                      {(() => {
                        const total = (activeVsInactive.active_users || 0) + (activeVsInactive.inactive_users || 0);
                        let angle = 0;
                        const pieData = [
                          { value: activeVsInactive.active_users || 0, color: "#007bff", label: "Active Users" },
                          { value: activeVsInactive.inactive_users || 0, color: "#dc3545", label: "Inactive Users" },
                        ];
                        return pieData.map((cat, i) => {
                          const startAngle = angle;
                          const endAngle = angle + (cat.value / (total || 1)) * 2 * Math.PI;
                          angle = endAngle;
                          const x1 = 16 + 16 * Math.cos(startAngle);
                          const y1 = 16 + 16 * Math.sin(startAngle);
                          const x2 = 16 + 16 * Math.cos(endAngle);
                          const y2 = 16 + 16 * Math.sin(endAngle);
                          const largeArc = cat.value / (total || 1) > 0.5 ? 1 : 0;
                          const pathData = `M16,16 L${x1},${y1} A16,16 0 ${largeArc},1 ${x2},${y2} Z`;
                          return (
                            <path
                              key={i}
                              d={pathData}
                              fill={cat.color}
                              stroke="#fff"
                              strokeWidth="0.5"
                              onMouseEnter={e => {
                                const rect = e.target.getBoundingClientRect();
                                setPieTooltip({
                                  show: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                  label: cat.label,
                                  value: cat.value,
                                  percent: total ? ((cat.value / total) * 100).toFixed(1) : 0,
                                  color: cat.color
                                });
                              }}
                              onMouseLeave={() => setPieTooltip({ ...pieTooltip, show: false })}
                            />
                          );
                        });
                      })()}
                    </svg>
                    {/* Pie Tooltip */}
                    {pieTooltip.show && (
                      <div
                        style={{
                          position: "fixed",
                          left: pieTooltip.x + 10,
                          top: pieTooltip.y - 50,
                          background: "#fff",
                          border: `1px solid ${pieTooltip.color}`,
                          borderRadius: 6,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          padding: "8px 14px",
                          zIndex: 9999,
                          pointerEvents: "none",
                          minWidth: 120,
                          color: pieTooltip.color,
                          fontWeight: 500
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{pieTooltip.label}</div>
                        <div>Count: {pieTooltip.value}</div>
                        <div>Percent: {pieTooltip.percent}%</div>
                      </div>
                    )}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 16, height: 16, background: "#007bff", display: "inline-block", borderRadius: 2 }}></span>
                        <span>Active Users</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ width: 16, height: 16, background: "#dc3545", display: "inline-block", borderRadius: 2 }}></span>
                        <span>Inactive Users</span>
                      </div>
                    </div>
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
