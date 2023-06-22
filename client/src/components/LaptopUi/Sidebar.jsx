import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import UserAvatar from "../../assets/cartoon_images/8.png";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import TroubleshootOutlinedIcon from "@mui/icons-material/TroubleshootOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Icon } from "@mui/material";
import { useDispatch } from "react-redux";
import { stateModifier } from "../../features/reducers/state-slice";
import { useSelector } from "react-redux";

function Sidebar() {
  const [userName, setUserName] = useState("Mary Jane");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.currState.value);

  useEffect(() => {
    dispatch(stateModifier("stream"));
  }, []);

  const handleStateModify = (val) => {
    dispatch(stateModifier(val));
  };

  return (
    <Box className="h-full overflow-hidden flex flex-col justify-evenly ">
      <Box className="mac-os-icons p-5 flex ">
        <div
          className="dot red bg-accent"
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            margin: "0 4px 0 0",
          }}
        ></div>
        <div
          className="dot amber bg-warning"
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            margin: "0 4px 0 0",
          }}
        ></div>
        <div
          className="dot green bg-primary"
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            margin: "0 4px 0 0",
          }}
        ></div>
      </Box>

      <Box className="user-intro flex justify-center items-center flex-col my-8 ">
        <img src={UserAvatar} style={{ width: "100px", height: "100px" }} />
        <Box>Welcome</Box>
        <Box>{userName}</Box>
      </Box>

      <Box className="  my-16 ">
        <span className="pl-5 text-left">ACTIONS</span>
        <Box className="user-actions my-5 px-8 text-xl flex justify-center items-center w-full flex-col">
          <Box
            className="action w-full my-3 cursor-pointer"
            onClick={() => handleStateModify("stream")}
          >
            <Icon
              fontSize="medium"
              component={VideocamOutlinedIcon}
              className={`${
                state == "stream" ? "text-warning" : "text-secondary-content"
              } `}
            />
            <span className="px-5">Stream</span>
          </Box>

          <Box
            className="action w-full my-3 cursor-pointer"
            onClick={() => handleStateModify("uploads")}
          >
            <Icon
              fontSize="medium"
              component={CloudDownloadOutlinedIcon}
              className={`${
                state == "uploads" ? "text-warning" : "text-secondary-content"
              } `}
            />
            <span className="px-5">Uploads</span>
          </Box>

          <Box
            className="action w-full my-3 cursor-pointer"
            onClick={() => handleStateModify("schedule")}
          >
            <Icon
              fontSize="medium"
              component={DateRangeOutlinedIcon}
              className={`${
                state == "schedule" ? "text-warning" : "text-secondary-content"
              } `}
            />
            <span className="px-5">Schedule</span>
          </Box>

          <Box
            className="action w-full my-3 cursor-pointer"
            onClick={() => handleStateModify("attendance")}
          >
            <Icon
              fontSize="medium"
              component={TroubleshootOutlinedIcon}
              className={`${
                state == "attendance"
                  ? "text-warning"
                  : "text-secondary-content"
              } `}
            />
            <span className="px-5 ">Attendance</span>
          </Box>
        </Box>
      </Box>

      <Box className="user-logout w-full flex justify-start px-3 cursor-pointer hover:text-warning items-center">
        <Icon
          fontSize="medium"
          component={LogoutIcon}
          className={`${
            state == "stream" ? "text-secondary-content" : "text-base-300"
          } `}
          onClick={() => console.log(state)}
        />
        <span className="px-5 ">Logout</span>
      </Box>
    </Box>
  );
}

export default Sidebar;
