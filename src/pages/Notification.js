import React from "react";
// import { Link } from "react-router-dom";

function Notification() {
  return (
    <>
              {/* <div className="main-content-wrap"> */}
                <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-box">
                  <i className="icon icon-bell" />
                  <div className="notification-content">
                    <p className="notification-title">
                      New stock plan added: <strong>Pro Plan</strong>
                    </p>
                    <div className="notification-time">2 minutes ago</div>
                  </div>
                  <span className="badge bg-primary notification-badge">
                    New
                  </span>
                </div>
                <div className="notification-box">
                  <i className="icon icon-check-circle" />
                  <div className="notification-content">
                    <p className="notification-title">
                      Payment successfully received.
                    </p>
                    <div className="notification-time">1 hour ago</div>
                  </div>
                </div>
                <div className="notification-box">
                  <i className="icon icon-calendar" />
                  <div className="notification-content">
                    <p className="notification-title">
                      System update scheduled at 3 AM.
                    </p>
                    <div className="notification-time">Yesterday</div>
                  </div>
                  <span className="badge bg-info text-dark notification-badge">
                    Info
                  </span>
                </div>
                <div className="notification-box">
                  <i className="icon icon-user" />
                  <div className="notification-content">
                    <p className="notification-title">
                      New user registered: <strong>John Doe</strong>
                    </p>
                    <div className="notification-time">2 days ago</div>
                  </div>
                </div>
                <div className="notification-box">
                  <i className="icon icon-trending-up" />
                  <div className="notification-content">
                    <p className="notification-title">
                      Stock trend alert for <strong>Tech Sector</strong>
                    </p>
                    <div className="notification-time">3 days ago</div>
                  </div>
                  <span className="badge bg-warning text-dark notification-badge">
                    Alert
                  </span>
                </div>
                <div className="notification-box">
                  <i className="icon icon-message-square" />
                  <div className="notification-content">
                    <p className="notification-title">
                      You have a new message from <strong>Admin</strong>
                    </p>
                    <div className="notification-time">4 days ago</div>
                  </div>
                  <span className="badge bg-danger notification-badge">
                    Message
                  </span>
                </div>
                <div className="notification-box">
                  <i className="icon icon-star" />
                  <div className="notification-content">
                    <p className="notification-title">
                      Your subscription has been upgraded to{" "}
                      <strong>Premium</strong>
                    </p>
                    <div className="notification-time">5 days ago</div>
                  </div>
                </div>
              {/* </div> */}
    </>
  );
}

export default Notification;
