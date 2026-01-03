import { NavLink } from 'react-router-dom';
import "../../styles/sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Lead Management System</h2>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }: { isActive: boolean }) =>
          isActive ? 'nav-link active' : 'nav-link'
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/leads"
         className={({ isActive }: { isActive: boolean }) =>
         isActive ? 'nav-link active' : 'nav-link'
  }

        >
          Leads
        </NavLink>

        <span className="nav-disabled">Users (coming)</span>
      </nav>
    </aside>
  );
};

export default Sidebar;
