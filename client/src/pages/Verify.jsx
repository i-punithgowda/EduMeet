import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Verify() {
  const params = useParams();
  const { email } = params;
  const navigate = useNavigate();
  const baseAPI = process.env.REACT_APP_BASEAPI;
  const handleVerification = async () => {
    try {
      const { data } = await axios.put(`${baseAPI}/verify`, {
        email: email,
      });
      if (data.status) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-neutral-content px-5 font-bold text-xl text-center tex-neutral-content">
      <h1 className="lg:text-5xl my-5 text-error-content">
        Lets verify you quickly!!
      </h1>
      <p>
        Your email address was used to create an{" "}
        <span className="text-blue-600 text-xl">EduMeet</span> acccount...
        please verify your account by clicking below button
      </p>
      <button
        className="btn btn-wide  btn-warning my-4"
        onClick={handleVerification}
      >
        Verify
      </button>
    </div>
  );
}

export default Verify;
