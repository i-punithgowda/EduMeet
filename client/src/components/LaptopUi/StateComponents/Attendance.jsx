import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../Loading";

function Attendance({ type, email, firstName, currentUser }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const baseAPI = process.env.REACT_APP_BASEAPI;

  const fetchHostAttendanceData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-attendance-host/${currentUser}`
      );
      //console.log(data);

      const temp = await Promise.all(
        data.map(async (obj) => {
          return {
            id: uuidv4(),
            title: obj.stream_title,
            name: obj.attendee_name,
            status: obj.attendance_status,
          };
        })
      );

      console.log(temp);

      setData(temp);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchGuestData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-attendance-guest/${currentUser}`
      );
      const temp = await Promise.all(
        data.map(async (obj) => {
          return {
            id: uuidv4(),
            title: obj.stream_title,
            status: obj.attendance_status,
          };
        })
      );

      console.log(temp);

      setData(temp);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    if (type == "Host") {
      fetchHostAttendanceData();
    } else {
      fetchGuestData();
    }
  }, []);

  const columnsHost = [
    {
      field: "title",
      headerName: "Stream Title",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Guest Name",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Attendance Status",
      flex: 1,
    },
  ];

  const columnsGuest = [
    {
      field: "title",
      headerName: "Stream Title",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Attendance Status",
      flex: 1,
    },
  ];

  if (type == "Host") {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Box className="w-full  h-full flex flex-col justify-center items-center">
          <h1 className="text-center text-xl font-bold ">
            Attendance data of streams
          </h1>
          <Box
            className="w-full h-3/6 flex justify-center items-center p-3"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: "#fff !important",
                // color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                // backgroundColor: colors.blueAccent[700],
                backgroundColor: "#000",
                color: "#fff",
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#fff",
                // backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#3e4396",
                display: "none",
                // backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: "#333 !important",
                // color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid
              className="datagrid"
              rows={data}
              columns={columnsHost}
              getRowId={(row) => row.id}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        </Box>
      );
    }
  } else {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Box className="w-full  h-full flex flex-col justify-center items-center">
          <h1 className="text-center text-xl font-bold ">
            Your Attendance Data
          </h1>
          <Box
            className="w-full h-3/6 flex justify-center items-center p-3"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: "#fff !important",
                // color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                // backgroundColor: colors.blueAccent[700],
                backgroundColor: "#000",
                color: "#fff",
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#fff",
                // backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#3e4396",
                display: "none",
                // backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: "#333 !important",
                // color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid
              className="datagrid"
              rows={data}
              columns={columnsGuest}
              getRowId={(row) => row.id}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        </Box>
      );
    }
  }
}

export default Attendance;
