import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import ScheduleImage from "../../../assets/svg/schedule.svg";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles({
  dateTimePicker: {
    backgroundColor: "#fff",
    padding: "5px",
    width: "100%",
    marginTop: 10,
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
  },
  textField: {
    backgroundColor: "#fff",
    padding: "10px",
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
    border: "none",
    outline: "none",
    "& .MuiInputBase-root": {
      "&:focus": {
        outline: "none",
      },
    },
  },
});

function Schedule(props) {
  const [state, setState] = useState("view");
  const [loading, setLoading] = useState(true);
  const [roomID, setRoomID] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const localizer = momentLocalizer(moment);
  const [FromselectedDate, FromhandleDateChange] = useState(new Date());
  const [ToselectedDate, TohandleDateChange] = useState(new Date());
  const baseAPI = process.env.REACT_APP_BASEAPI;
  const currentUser = sessionStorage.getItem("user");
  const [eventList, setEventList] = useState([]);
  const type = props.type;

  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const events = [
    {
      id: 1,
      title: "Event 1",
      start: new Date(2023, 5, 21, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
      end: new Date(2023, 5, 21, 12, 0),
    },
    {
      id: 2,
      title: "Event 2",
      start: new Date(2023, 5, 22, 14, 0),
      end: new Date(2023, 5, 22, 16, 0),
    },
    {
      id: 2,
      title: "Host 2",
      start: new Date(2023, 5, 19, 11, 0),
      end: new Date(2023, 5, 19, 13, 0),
    },
    // Add more events as needed
  ];

  const classes = useStyles();

  const dateFormatter = (date) => {
    return new Promise((resolve, reject) => {
      try {
        const dateTime = new Date(date);
        const formattedDate = dateTime.toISOString().split("T")[0];
        const formattedTime = dateTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        resolve({ formattedDate: formattedDate, formattedTime: formattedTime });
      } catch (err) {
        reject({ err: err });
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const FromDate = await dateFormatter(FromselectedDate);
      const ToDate = await dateFormatter(ToselectedDate);
      const status = window.confirm(
        `Are you sure u want to schedule a meet between ${FromDate.formattedDate} ${FromDate.formattedTime} & ${ToDate.formattedDate} ${ToDate.formattedTime}`
      );
      if (status) {
        const { data } = await axios.post(`${baseAPI}/save-schedule`, {
          fromDate: FromDate,
          toDate: ToDate,
          host_id: currentUser,
          meeting_name: meetingName,
          room_id: roomID,
        });
        console.log(data);
        alert(data.message);
        setLoading(true);
        fetchEventList(roomID);
        setLoading(false);
        setState("view");
      }
      //console.log(roomID);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchEventList = async (room_id) => {
    const { data } = await axios.get(`${baseAPI}/get-meetings/${room_id}`);

    const convertedData = data.map((item) => {
      const startDate = new Date(item.class_date);
      const startTimeParts = item.time_from.split(":");
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const startDateofMonth = startDate.getDate();
      const startHour = parseInt(startTimeParts[0]);
      const startMinute = parseInt(startTimeParts[1]);

      console.log({
        startYear: startYear,
        startMonth: startMonth,
        startDate: startDateofMonth,
        startHour: startHour,
        startMinute: startMinute,
      });

      const endDate = new Date(item.class_date);
      const endTimeParts = item.time_to.split(":");
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();
      const endDateofMonth = endDate.getDate();
      const endHour = parseInt(endTimeParts[0]);
      const endMinute = parseInt(endTimeParts[1]);

      return {
        id: item.id,
        title: item.meeting_name,
        start: new Date(
          startYear,
          startMonth,
          startDateofMonth,
          startHour,
          startMinute
        ),
        end: new Date(endYear, endMonth, endDateofMonth, endHour, endMinute),
      };
    });

    console.log(convertedData);
    setEventList(convertedData);
  };

  const fetchRoomID = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-college-dept/${currentUser}`
      );
      setRoomID(data.roomID);
      fetchEventList(data.roomID);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchRoomID();
  }, []);

  if (state == "view") {
    if (loading) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <Box className="w-full h-full bg-error p-3 flex flex-col justify-around items-center">
          <h1 className="text-center py-3 text-2xl text-accent-content">
            {" "}
            View Current Schedule
          </h1>

          <Calendar
            localizer={localizer}
            events={eventList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: 900 }}
            className="bg-secondary-content p-3"
          />

          {type && type == "Host" ? (
            <span
              className="text-neutral font-bold text-xl underline cursor-pointer"
              onClick={() => setState("set")}
            >
              Click here to schedule a meet
            </span>
          ) : null}
        </Box>
      );
    }
  } else {
    return (
      <Box className="w-full h-full bg-error p-3 flex flex-col justify-around items-center">
        <h1 className="text-center py-3 text-2xl text-accent-content">
          {" "}
          Create a new Meeting
        </h1>

        <Box className="w-full flex justify-center items-center">
          <img
            src={ScheduleImage}
            alt=""
            style={{ width: "200px", height: "200px" }}
          />
        </Box>

        <Box className="w-full flex justify-center items-center flex-col ">
          <TextField
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="Enter Meeting Name"
            className={classes.textField}
            InputProps={{ disableUnderline: true }}
          />

          <Box>
            <h1>Select From </h1>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                value={FromselectedDate}
                onChange={(e) => {
                  FromhandleDateChange(e);
                }}
                InputProps={{ disableUnderline: true }}
                className={classes.dateTimePicker}
                minutesStep={5}
                minDate={currentDate}
                minTime={currentTime}
              />
            </MuiPickersUtilsProvider>
          </Box>

          <Box className="my-3">
            <h1>Select to</h1>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                value={ToselectedDate}
                onChange={(e) => {
                  TohandleDateChange(e);
                }}
                InputProps={{ disableUnderline: true }}
                minutesStep={5}
                className={classes.dateTimePicker}
                minDate={currentDate}
                minTime={currentTime}
              />
            </MuiPickersUtilsProvider>
          </Box>

          <button className="btn btn-secondary" onClick={handleSubmit}>
            Submit
          </button>
        </Box>

        <span
          className="text-neutral font-bold text-xl underline cursor-pointer"
          onClick={() => setState("view")}
        >
          Click here to view schedules
        </span>
      </Box>
    );
  }
}

export default Schedule;
