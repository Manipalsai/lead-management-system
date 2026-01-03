import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <h2 className="section-title">Dashboard</h2>
      <p className="section-subtitle">
        Overview of lead management system
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Leads</h4>
          <span>0</span>
        </div>

        <div className="stat-card">
          <h4>New Leads</h4>
          <span>0</span>
        </div>

        <div className="stat-card">
          <h4>Contacted</h4>
          <span>0</span>
        </div>

        <div className="stat-card">
          <h4>Converted</h4>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
