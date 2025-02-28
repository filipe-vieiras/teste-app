import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import DashboardLayout from './DashboardLayout';
import { fetchNPSData } from '../services/trackcoService';
import BusinessCanvas from './BusinessCanvas/BusinessCanvas';
import Analytics from './Analytics/Analytics';
import TeamCollaboration from './TeamCollaboration/TeamCollaboration';
import ProjectManagement from './ProjectManagement/ProjectManagement';

// Add ContentRenderer component
function ContentRenderer({ darkMode, activeMenu }) {
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Dashboard
            </h2>
            <Analytics darkMode={darkMode} />
          </div>
        );
      
      case 'feature1':
        return (
          <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <BusinessCanvas />
          </div>
        );
      // In your ContentRenderer, add this new case:
      case 'documentation':
        return (
          <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Application Documentation
            </h2>
            
            <div className={`space-y-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <section>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'} border-b pb-2`}>
                  Creating New Components
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Step 1: Component Structure</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`import React from 'react';
            
            function NewComponent({ prop1, prop2 }) {
              return (
                <div className="your-tailwind-classes">
                  {/* Your component content */}
                </div>
              );
            }
            
            export default NewComponent;`}
                    </pre>
                  </div>
            
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Step 2: Add to Sidebar</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`<li>
              <button
                onClick={() => setActiveMenu('newFeature')}
                className=\`w-full flex items-center text-white p-2 rounded-lg hover:bg-opacity-25 hover:bg-white \${activeMenu === 'newFeature' ? 'bg-white bg-opacity-10' : ''}\`
              >
                <svg className="w-6 h-6 mr-3" {...svgProps} />
                New Feature
              </button>
            </li>`}
                    </pre>
                  </div>
            
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Step 3: Add Content Renderer Case</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`case 'newFeature':
              return (
                <div className=\`p-4 \${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow\`>
                  <h2 className=\`text-xl font-semibold mb-4 \${darkMode ? 'text-white' : 'text-gray-900'}\`>
                    New Feature
                  </h2>
                  <YourNewComponent />
                </div>
              );`}
                    </pre>
                  </div>
                </div>
              </section>
      
              <section>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'} border-b pb-2`}>
                  Tailwind CSS Guide
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Common Patterns</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">flex items-center</code> - Center items vertically</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">justify-between</code> - Space items evenly</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">space-y-4</code> - Vertical spacing between children</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">hover:bg-opacity-25</code> - Hover effects</li>
                    </ul>
                  </div>
      
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Dark Mode</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`// Example of dark mode classes
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"`}
                    </pre>
                  </div>
      
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Responsive Design</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">sm:</code> - 640px and up</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">md:</code> - 768px and up</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">lg:</code> - 1024px and up</li>
                      <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">xl:</code> - 1280px and up</li>
                    </ul>
                  </div>
                </div>
              </section>
      
              <section>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'} border-b pb-2`}>
                  State Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Using Supabase</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`// Example of Supabase query
            const { data, error } = await supabase
              .from('your_table')
              .select('*')
              .eq('column', 'value');`}
                    </pre>
                  </div>
      
                  <div>
                    <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>React State</h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
            {`const [state, setState] = useState(initialValue);
            useEffect(() => {
              // Side effects here
            }, [dependencies]);`}
                    </pre>
                  </div>
                </div>
              </section>
      
              <section>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'} border-b pb-2`}>
                  Best Practices
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Keep components small and focused on a single responsibility</li>
                  <li>Use meaningful names for components and functions</li>
                  <li>Extract reusable styles into custom Tailwind classes</li>
                  <li>Implement proper error handling for async operations</li>
                  <li>Use TypeScript for better type safety</li>
                  <li>Follow the existing project structure for consistency</li>
                </ul>
              </section>
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <TeamCollaboration darkMode={darkMode} />
          </div>
        );
        
      case 'projects':
        return (
          <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <ProjectManagement darkMode={darkMode} />
          </div>
        );
        
    default:
      return null;
    }
  };

  return renderContent();
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.replace('/login');
        return;
      }
    } catch (error) {
      console.error('Session error:', error);
      window.location.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.replace('/login');
    } catch (error) {
      console.error('Error:', error);
      window.location.replace('/login');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-white ${
          isSidebarOpen ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <DashboardLayout
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        handleSignOut={handleSignOut}
      >
        <ContentRenderer darkMode={darkMode} activeMenu={activeMenu} />
      </DashboardLayout>
    </div>
  );
}

export default Dashboard;