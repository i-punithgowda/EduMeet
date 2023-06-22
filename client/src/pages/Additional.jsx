import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Additional(props) {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(sessionStorage.getItem("email"));
  }, []);

  const types = [
    {
      id: "1",
      type: "Host",
    },
    {
      id: "2",
      type: "Guest",
    },
  ];
  const baseAPI = process.env.REACT_APP_BASEAPI;

  const fetchColleges = async () => {
    try {
      const { data } = await axios.get(`${baseAPI}/get-colleges`);
      setColleges(data);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleChange = async (e) => {
    try {
      const val = e.target.value;
      const { data } = await axios.get(`${baseAPI}/get-dept/${val}`);
      console.log(data);
      setSelectedCollege(val);
      setDepartments(data);
    } catch (err) {
      alert(err);
    }
  };

  const handleClick = async () => {
    try {
      const { data } = await axios.put(`${baseAPI}/additional-info`, {
        name: name,
        type: userType,
        college_id: selectedCollege,
        department_id: selectedDepartment,
        email: email,
      });
      alert(data.message);
      props.setNewUser(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="additional-details-container h-screen w-screen flex justify-center items-center lg:bg-secondary ">
      <div className="user-info w-full h-full lg:w-8/12 bg-neutral-content  lg:h-5/6 lg:rounded-2xl p-5 flex justify-center items-center flex-col">
        <h1 className="text text-secondary text-xl lg:text-3xl font-bold">
          {" "}
          New here ? we need few more details!!
        </h1>

        <div className="fields-container  flex flex-col    h-5/6 lg:h-4/6 justify-evenly items-center w-10/12">
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "300px", sm: "300px", md: "500px", lg: "600px" },
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            disabled
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "300px", sm: "300px", md: "500px", lg: "600px" },
            }}
            value={email}
          />

          <TextField
            select
            onChange={handleChange}
            id="outlined-basic"
            label="College name"
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "300px", sm: "300px", md: "500px", lg: "600px" },
            }}
          >
            {colleges.length > 0
              ? colleges.map((college) => (
                  <MenuItem key={college.id} value={college.id}>
                    {college.college_name}
                  </MenuItem>
                ))
              : null}
          </TextField>

          <TextField
            select
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              console.log(e.target.value);
            }}
            id="outlined-basic"
            label="Department name"
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "300px", sm: "300px", md: "500px", lg: "600px" },
            }}
          >
            {departments.length > 0
              ? departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.department_name}
                  </MenuItem>
                ))
              : null}
          </TextField>

          <TextField
            select
            onChange={(e) => {
              setUserType(e.target.value);
              console.log(e.target.value);
            }}
            id="outlined-basic"
            label="User Type"
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "300px", sm: "300px", md: "500px", lg: "600px" },
            }}
          >
            {types.length > 0
              ? types.map((type) => (
                  <MenuItem key={type.id} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))
              : null}
          </TextField>

          <div className="flex w-full justify-center  items-center">
            <button className="btn btn-secondary" onClick={handleClick}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Additional;
