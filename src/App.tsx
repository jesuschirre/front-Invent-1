import { useState } from "react";
import Sidebar from "./components/organismos/sidebar/Sidebar";
import Routers from "./routes/routes";
import { AuthContextProvider } from "./index";
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
              
              {/* Sidebar */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              {/* Content */}
              <div className="flex-1 flex flex-col">


                <main className="flex-1 bg-gray-300 overflow-y-auto bg-grid">
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