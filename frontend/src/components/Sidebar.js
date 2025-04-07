import React from 'react';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">5G Sports</div>
      <ul className="nav-list">
        <li className="active">Overview</li>
        <li>Players</li>
        <li>Plan</li>
        <li>Goals</li>
        <li>Progress</li>
      </ul>
    </div>
  );
}

export default Sidebar;
