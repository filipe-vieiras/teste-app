import { Sidebar } from 'flowbite-react';
import { HiChartPie, HiUsers, HiFolder, HiCalendar, HiLogout, HiTemplate } from 'react-icons/hi';

export default function FlowbiteLayout({ children, darkMode, activeMenu, setActiveMenu, handleSignOut }) {
  return (
    <div className={`flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <Sidebar aria-label="Sidebar" className="h-full">
          <Sidebar.Logo href="#" img="/logo.png" imgAlt="Logo">
            BrokenMachines
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item 
                href="#" 
                icon={HiChartPie}
                active={activeMenu === 'dashboard'}
                onClick={() => setActiveMenu('dashboard')}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item 
                href="#" 
                icon={HiTemplate}
                active={activeMenu === 'leancanvas'}
                onClick={() => setActiveMenu('leancanvas')}
              >
                Lean Canvas
              </Sidebar.Item>
              <Sidebar.Item 
                href="#" 
                icon={HiUsers}
                active={activeMenu === 'team'}
                onClick={() => setActiveMenu('team')}
              >
                Team
              </Sidebar.Item>
              <Sidebar.Item 
                href="#" 
                icon={HiFolder}
                active={activeMenu === 'projects'}
                onClick={() => setActiveMenu('projects')}
              >
                Projects
              </Sidebar.Item>
              <Sidebar.Item 
                href="#" 
                icon={HiCalendar}
                active={activeMenu === 'calendar'}
                onClick={() => setActiveMenu('calendar')}
              >
                Calendar
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item 
                href="#" 
                icon={HiLogout}
                onClick={handleSignOut}
              >
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}