import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Stream from "./StateComponents/Stream";
import Uploads from "./StateComponents/Uploads";
import Schedule from "./StateComponents/Schedule";
import Attendance from "./StateComponents/Attendance";
function StateArea({ currentUser, userType, email, firstName }) {
  const state = useSelector((state) => state.currState.value);
  console.log("userrrr", userType);

  return (
    <div className="h-full w-full">
      {state == "stream" ? (
        <Stream
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "uploads" ? (
        <Uploads
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "schedule" ? (
        <Schedule
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "attendance" ? (
        <Attendance
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : null}
    </div>
  );
}

export default StateArea;
