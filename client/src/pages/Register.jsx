import React, { useState } from "react";
import EduMeetLogo from "../assets/png/EduMeetLogo.png";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthImage from "../assets/svg/auth.svg";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLoginButton } from "react-social-login-buttons";
import Typewriter from "typewriter-effect";

function Register() {
  const baseURL = process.env.REACT_APP_BASEAPI;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useGoogleLogin({
    clientId:
      "867159813249-kjf4fe4ne3bujmvmkv4jncaeus9aanbt.apps.googleusercontent.com",
    onSuccess: async (response) => {
      console.log(response);
      const accessToken = response.access_token;
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );

      const res = await axios.post(`${baseURL}/oauth`, {
        email: email,
      });
      console.log(res);

      if (res.data.status === true) {
        const response = await axios.post(`${baseURL}/get-status`, {
          email: data.email,
        });
        console.log("New User : ", response.data[0].new_user);
        console.log("Is verified : ", response.data[0].isVerified);

        const userStatus = response.data[0];
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("user", response.data[0].id);

        if (userStatus.new_user == 1 && userStatus.isVerified == 1) {
          navigate("/additional");
        } else if (userStatus.new_user == 0 && userStatus.isVerified == 1) {
          navigate("/dashboard");
        } else if (userStatus.new_user == 1 && userStatus.isVerified == 0) {
          navigate("/verification");
        }
      }
    },
    onError: (error) => {
      console.log("Login Failure. Error: ", error);
    },
  });

  const handleRegister = async () => {
    try {
      const { data } = await axios.post(`${baseURL}/create-user`, {
        email: email,
        password: password,
      });

      alert(data.message);
    } catch (err) {
      alert("Error : ", err);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-base-200">
      <div className="container-registration flex justify-center items-center w-full h-full">
        <div className="sidebar w-4/12 bg-secondary lg:h-4/6 rounded-tl-3xl lg:rounded-bl-3xl hidden lg:block ">
          <div className="w-full flex justify-evenly flex-col items-center h-full p-5">
            <img src={AuthImage} alt="auth image" className="w-96" />

            <div className="text-md font-bold text-secondary-content">
              <Typewriter
                options={{
                  delay: 50, // Adjust the delay between each character
                  deleteSpeed: 50, // Adjust the speed of deleting characters
                  loop: true, // Set to false if you don't want the typewriter effect to repeat
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString(
                      "No need to worry about missed sessions. Now view your video session at any time. Much more exciting features are awaiting you!!"
                    )
                    .callFunction(() => {
                      console.log("String typed out!");
                    })
                    .pauseFor(2500)
                    .deleteAll()
                    .callFunction(() => {
                      console.log("All strings were deleted");
                    })
                    .start();
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="auth-part w-full lg:w-4/12 bg-neutral-content lg:bg-neutral-content 
        h-full lg:h-4/6 lg:rounded-tr-3xl lg:rounded-br-3xl flex flex-col justify-center items-center"
        >
          <div className="logo w-12 lg:w-16">
            <img src={EduMeetLogo} alt="logo" className="w-full" />
          </div>
          <div className="auth w-full h-4/6 flex justify-evenly items-center flex-col">
            <h1 className="text-3xl text-secondary font-bold text-center">
              Welcome to Edu Meet
            </h1>
            <div className="form-group flex flex-col justify-center items-center w-full">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                size="small"
                sx={{ width: "300px", marginY: "10px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                size="small"
                sx={{ width: "300px", marginY: "10px" }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="btn btn-secondary btn-wide my-5"
                onClick={handleRegister}
              >
                Register
              </button>

              <GoogleLoginButton
                onClick={signIn}
                style={{
                  width: "200px",
                  backgroundColor: "#000",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
                preventActiveStyles={true}
                text="Sign in with google"
              />

              <Link
                to="/login"
                className="text-neutral font-bold text-center w-full my-5"
              >
                Have an account ?{" "}
                <span className="text-secondary">Login here</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
