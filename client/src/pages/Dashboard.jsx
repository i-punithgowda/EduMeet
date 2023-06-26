import React, { useEffect, useState } from "react";
import Sidebar from "../components/LaptopUi/Sidebar";
import StateArea from "../components/LaptopUi/StateArea";
import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";
import axios from "axios";
import Loading from "../components/Loading";
import StateAreaMobile from "../components/MobileUi/StateAreaMobile";
import MobileNavbar from "../components/MobileUi/MobileNavbar";
function Panel() {
  const currentUser = sessionStorage.getItem("user");
  const email = sessionStorage.getItem("email");
  const [userType, setUserType] = useState("");
  const baseURL = process.env.REACT_APP_BASEAPI;
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const fetchuserType = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/get-user/${currentUser}`);
      setUserType(data[0].type);
      setFirstName(data[0].name);
      setLoading(false);
    } catch (err) {
      alert(err.data.response.message);
    }
  };

  useEffect(() => {
    fetchuserType();
  }, []);

  const isLaptopScreen = useMediaQuery("(min-width: 1280px)");
  if (isLaptopScreen) {
    return (
      <div>
        {!loading ? (
          <div
            className="h-screen w-screen flex justify-center items-center text-secondary-content"
            style={{ backgroundColor: "gainsboro" }}
          >
            <div className="flex justify-center items-center w-10/12 h-5/6 bg-neutral rounded-2xl">
              <div className="w-2/12 h-full">
                <Sidebar />
              </div>
              <div className="w-10/12 h-full flex justify-center items-center ">
                <Box
                  sx={{
                    width: "98%",
                    height: "98%",
                    color: "#000",
                    backgroundColor: "#586176",
                  }}
                >
                  {userType.length > 0 ? (
                    <StateArea
                      currentUser={currentUser}
                      userType={userType}
                      email={email}
                      firstName={firstName}
                    />
                  ) : null}
                </Box>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    );
  } else {
    return (
      <div className="flex w-screen h-screen  bg-secondary ">
        {loading ? (
          <Loading />
        ) : (
          <div className="main-container flex flex-col w-full ">
            <MobileNavbar />
            <StateAreaMobile
              currentUser={currentUser}
              userType={userType}
              email={email}
              firstName={firstName}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Panel;
