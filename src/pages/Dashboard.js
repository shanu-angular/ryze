
function Dashboard() {
  // Mock stats
  const stats = [
    { label: "Total Users", value: 200, change: "+12% from last week", color: "text-success" },
    { label: "Total Loans", value: 1540, change: "+5% from last week", color: "text-success" },
    { label: "Total Goals", value: 320, change: "-2% from yesterday", color: "text-danger" },
    { label: "Active Users", value: 180, change: "-8% from yesterday", color: "text-danger" },
  ];

  // Chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const userData = [120, 150, 180, 200, 220];
  const loanData = [1000, 1200, 1300, 1540, 1600];
  const goalData = [200, 250, 300, 320, 350];

  // Pie chart data
  const activeUsers = 180;
  const inactiveUsers = 20;

  // Helper for bar chart max value
  const maxBar = Math.max(...userData, ...loanData, ...goalData);

  return (
    <>
    
        <div className="row mb-4">
          {stats.map((stat, idx) => (
            <div className="col-md-3 mb-3" key={idx}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-bold text-muted mb-1">{stat.label}</div>
                  <div className="h3 mb-1">{stat.value}</div>
                  <div className={stat.color}>{stat.change}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">Monthly Users, Loans, Goals</h5>
                <div style={{ width: "100%", height: 320, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", height: 220 }}>
                    {months.map((month, i) => (
                      <div key={month} style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", height: 200, gap: 4 }}>
                          <div style={{
                            width: 18,
                            height: `${(userData[i] / maxBar) * 180}px`,
                            background: "#007bff",
                            borderRadius: 4,
                          }} title={`Users: ${userData[i]}`}></div>
                          <div style={{
                            width: 18,
                            height: `${(loanData[i] / maxBar) * 180}px`,
                            background: "#28a745",
                            borderRadius: 4,
                          }} title={`Loans: ${loanData[i]}`}></div>
                          <div style={{
                            width: 18,
                            height: `${(goalData[i] / maxBar) * 180}px`,
                            background: "#ffc107",
                            borderRadius: 4,
                          }} title={`Goals: ${goalData[i]}`}></div>
                        </div>
                        <div style={{ fontSize: 14, marginTop: 8 }}>{month}</div>
                      </div>
                    ))}
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
                  <svg width="180" height="180" viewBox="0 0 32 32">
                    {(() => {
                      const total = activeUsers + inactiveUsers;
                      let angle = 0;
                      const pieData = [
                        { value: activeUsers, color: "#007bff" },
                        { value: inactiveUsers, color: "#dc3545" },
                      ];
                      return pieData.map((cat, i) => {
                        const startAngle = angle;
                        const endAngle = angle + (cat.value / total) * 2 * Math.PI;
                        angle = endAngle;
                        const x1 = 16 + 16 * Math.cos(startAngle);
                        const y1 = 16 + 16 * Math.sin(startAngle);
                        const x2 = 16 + 16 * Math.cos(endAngle);
                        const y2 = 16 + 16 * Math.sin(endAngle);
                        const largeArc = cat.value / total > 0.5 ? 1 : 0;
                        const pathData = `M16,16 L${x1},${y1} A16,16 0 ${largeArc},1 ${x2},${y2} Z`;
                        return <path key={i} d={pathData} fill={cat.color} stroke="#fff" strokeWidth="0.5" />;
                      });
                    })()}
                  </svg>
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
  );
}

export default Dashboard;
