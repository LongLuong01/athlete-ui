import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function Sidebar() {
  const { user, logout, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [athlete, setAthlete] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="Toggle sidebar"]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch athlete data
  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/athletes/${userInfo?.athleteId}`
        );
        const data = await response.json();
        setAthlete(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    if (userInfo?.athleteId) {
      fetchAthlete();
    }
  }, [userInfo]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setIsOpen(false); // Đóng sidebar trước khi chuyển trang
    navigate(path);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        type="button"
        aria-label="Toggle sidebar"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full bg-gray-50">
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              {/* User Information */}
              <li>
                <button
                  onClick={() => handleNavigation('/user-info')}
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                    isActivePath('/user-info') ? 'bg-gray-200' : ''
                  }`}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="ms-3 whitespace-nowrap">User Information</span>
                </button>
              </li>

              {/* Well-being review */}
              <li>
                <button
                  onClick={() => handleNavigation('/review')}
                  className={`flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                    isActivePath('/review') ? 'bg-gray-200' : ''
                  }`}
                >
                  <svg
                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>
                  <span className="ms-3 whitespace-nowrap">
                    Daily Well-being review
                  </span>
                </button>
              </li>

              {/* Sign Out */}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span className="ms-3 whitespace-nowrap">Sign Out</span>
                </button>
              </li>
            </ul>
          </div>

          {/* User Profile Section - Fixed at bottom */}
          <div className="border-t border-gray-200 p-4 mt-auto bg-gray-100">
            <div className="flex items-center space-x-4">
              <img
                src={athlete?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(athlete?.username || "User")}
                alt="User avatar"
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {athlete?.username || userInfo?.fullname || "Loading..."}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {athlete?.email || userInfo?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
