import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../styles/dashboard.css';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-section">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
