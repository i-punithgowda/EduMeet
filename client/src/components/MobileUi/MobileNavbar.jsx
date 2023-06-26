import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { stateModifier } from "../../features/reducers/state-slice";
import { Icon, Tooltip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function MobileNavbar() {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown open/close

  const handleStateModify = (val) => {
    dispatch(stateModifier(val));
    setDropdownOpen(false); // Close the dropdown after selecting an option
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          {dropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li onClick={() => handleStateModify("stream")}>
                <a>Stream</a>
              </li>
              <li onClick={() => handleStateModify("uploads")}>
                <a>Uploads</a>
              </li>
              <li onClick={() => handleStateModify("attendance")}>
                <a>Attendance</a>
              </li>
              <li onClick={() => handleStateModify("schedule")}>
                <a>Schedule</a>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-center">
        <span className="text-blue-600 text-xl">Edu</span>
        <span className="text-neutral text-xl">Meet</span>
      </div>
      <div className="navbar-end">
        <Tooltip title="punith">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Icon component={PersonIcon} />
            </div>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default MobileNavbar;
