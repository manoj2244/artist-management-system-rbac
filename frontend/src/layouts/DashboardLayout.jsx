import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

function DashboardLayout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
