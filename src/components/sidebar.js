import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  // ...existing code...

  return (
    <>
      {/* section-menu-left */}
      <div className="section-menu-left">
        <div className="box-logo">
          <Link to="/" id="site-logo-inner">
            <img className="" id="logo_header" alt="" src="assets/images/logo/logo.png" style={{ width: "50px" }} />
          </Link>
          <div className="button-show-hide">
            <i className="icon-menu-left"></i>
          </div>
        </div>
        <div className="center">
          <div className="center-item">
            <ul className="menu-list">
              <li className={`menu-item${location.pathname === '/dashboard' ? ' active' : ''}`}>
                <Link to="/dashboard" className="menu-item-button">
                  <div className="icon"><i className="icon-grid"></i></div>
                  <div className="text">Dashboard</div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="center-item">
            <ul className="menu-list">
              <li className={`menu-item${location.pathname === '/user' ? ' active' : ''}`}>
                <Link to="/user" className="menu-item-button">
                  <div className="icon"><i className="icon-users"></i></div>
                  <div className="text">Users</div>
                </Link>
              </li>
              {/* Uncomment and add active logic for more menu items as needed */}
              {/* <li className={`menu-item${location.pathname === '/goals' ? ' active' : ''}`}>
                <Link to="/goals" className="menu-item-button">
                  <div className="icon"><i className="icon-list"></i></div>
                  <div className="text">Goals</div>
                </Link>
              </li> */}
              {/* <li className={`menu-item${location.pathname === '/income' ? ' active' : ''}`}>
                <Link to="/income" className="menu-item-button">
                  <div className="icon"><i className="icon-credit-card"></i></div>
                  <div className="text">Income</div>
                </Link>
              </li> */}
              <li className={`menu-item${location.pathname === '/notifications' ? ' active' : ''}`}>
                <Link to="/notifications" className="menu-item-button">
                  <div className="icon"><i className="icon-bell"></i></div>
                  <div className="text">Notifications</div>
                </Link>
              </li>
              <li className={`menu-item${location.pathname === '/' ? ' active' : ''}`}>
                <Link to="/" className="menu-item-button">
                  <div className="icon"><i className="icon-log-out"></i></div>
                  <div className="text">Logout</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;