import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StreamMobile from "./StateComponents/StreamMobile";
import AttendanceMobile from "./StateComponents/AttendanceMobile";
import UploadsMobile from "./StateComponents/UploadsMobile";
import ScheduleMobile from "./StateComponents/ScheduleMobile";
import { stateModifier } from "../../features/reducers/state-slice";
function StateAreaMobile({ currentUser, userType, email, firstName }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.currState.value);
  useEffect(() => {
    dispatch(stateModifier("stream"));
  }, []);

  return (
    <div className="h-full w-full">
      {state == "stream" ? (
        <StreamMobile
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "uploads" ? (
        <UploadsMobile
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "schedule" ? (
        <ScheduleMobile
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : state == "attendance" ? (
        <AttendanceMobile
          currentUser={currentUser}
          email={email}
          type={userType}
          firstName={firstName}
        />
      ) : null}
    </div>
  );
}

export default StateAreaMobile;
