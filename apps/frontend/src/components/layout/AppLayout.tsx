import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main Content Handler (pushed by sidebar 256px / 16rem) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
