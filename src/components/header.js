import { Link } from "react-router-dom"


import React, { useState, useRef, useEffect } from "react";

const Header = ({ onLogout, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // const handleToggleSidebar = () => {
  //   if (onToggleSidebar) {
  //     onToggleSidebar();
  //   }
  // };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    if (onLogout) onLogout();
    window.location.href = "/";
  };

  const handleSidebarToggle = () => {
    if (onToggleSidebar) onToggleSidebar();
    // Optionally, you can also manage sidebar state here if needed
  };

  return (
    <div className="header-dashboard">
      <div className="wrap">
        <div className="header-left">
          <Link to="/dashboard">
            <img
              className=""
              id="logo_header_mobile"
              alt=""
              src="/assets/images/logo/logo.png"
              style={{ width: "50px" }}
            />
          </Link>
          <div className="button-show-hide" onClick={handleSidebarToggle} style={{ cursor: 'pointer' }}>
            <i className="icon-menu-left"></i>
          </div>
        </div>
        <div className="header-grid">
          <div className="popup-wrap user type-header">
            <div className="dropdown" ref={dropdownRef}>
              <button
                className={"btn btn-secondary dropdown-toggle" + (dropdownOpen ? " show" : "")}
                type="button"
                id="dropdownMenuButton3"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <span className="header-user wg-user">
                  <span className="image">
                    <img src="/assets/images/avatar/user-1.png" alt="" />
                  </span>
                  <span className="flex flex-column">
                    <span className="body-title mb-2">Kristin Watson</span>
                    <span className="text-tiny">Admin</span>
                  </span>
                </span>
              </button>
              <ul
                className={
                  "dropdown-menu dropdown-menu-end has-content" +
                  (dropdownOpen ? " show" : "")
                }
                aria-labelledby="dropdownMenuButton3"
                style={{ display: dropdownOpen ? "block" : "none" }}
              >
                {/* <li>
                  <Link to="/profile" className="user-item" style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <div className="icon">
                      <i className="icon-user"></i>
                    </div>
                    <div className="body-title-2">Profile</div>
                  </Link>
                </li> */}
                <li>
                  <button className="user-item" onClick={handleLogout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                    <div className="icon">
                      <i className="icon-log-out"></i>
                    </div>
                    <div className="body-title-2">Log out</div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header
