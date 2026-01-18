import { useState } from "react";
import Sidebar from "./components/organismos/sidebar/Sidebar";
import Routers from "./routes/routes";
import { AuthContextProvider } from "./index";
import { RiMenu2Line } from "react-icons/ri";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {pathname} = useLocation();
  return (
    <AuthContextProvider>
      <ThemeProvider>
            {
              pathname != "/login" ? (<div className="flex h-screen overflow-hidden">
              {/* Overlay mobile */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              {/* Content */}
              <div className="flex-1 flex flex-col">

                {/* Header (mobile) */}
                <header className="md:hidden h-14 flex items-center px-4 bg-gray-900 text-white ">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded hover:bg-gray-800"
                  >
                    <RiMenu2Line size={22} />
                  </button>
                  <span className="ml-3 font-semibold">Mi App</span>
                </header>

                <main className="flex-1 bg-gray-300 overflow-y-auto dark:bg-gray-900">
                    <Routers />
                </main>

                <ReactQueryDevtools initialIsOpen={false} />
              </div>
            </div>) : (<Login/>) 
          }
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;