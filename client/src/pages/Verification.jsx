import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Verification() {
  const navigate = useNavigate("");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container-verification w-screen h-screen flex justify-center items-center bg-neutral-content">
      <div className="main-verification-container flex justify-evenly items-center flex-col h-48">
        <h1 className="text-2xl text-neutral-content text-center font-bold">
          Verify your account before proceeding!!!
        </h1>
        <p className="text-xl text- text-center font-bold">
          Please check your email for verification link
        </p>
        <button className="btn btn-error  btn-wide" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Verification;
