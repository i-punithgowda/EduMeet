import React, { useState, useEffect, useRef } from "react";
import JoinRoom from "../Room/JoinRoom";
import axios from "axios";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Box, Icon } from "@mui/material";
import CartoonImage from "../../../assets/svg/girl.svg";
import { useDispatch } from "react-redux";
import { stateModifier } from "../../../features/reducers/state-slice";
import Loading from "../../Loading";

function Stream({ currentUser, email, type, firstName }) {
  const [loading, setLoading] = useState(true);
  const [streamingStatus, setStreamingStatus] = useState(false);
  const baseAPI = process.env.REACT_APP_BASEAPI;
  const videoRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [roomID, setRoomID] = useState("");
  const [currentStreamId, setCurrStreamID] = useState("");
  const dispatch = useDispatch();

  const fetchStreamingStatus = async (url) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseAPI}/${url}/${email}`);
      console.log("asfsddf", data);
      setStreamingStatus(data.status);
      setRoomID(data.room_id);
      setLoading(false);
    } catch (err) {
      alert(err.data.response.message);
    }
  };

  const handleJoinStream = async () => {
    try {
      if (title !== "" && description !== "") {
        const { data } = await axios.post(`${baseAPI}/save-stream-details`, {
          title: title,
          description: description,
          host_id: currentUser,
        });

        setCurrStreamID(data.id);
        localStorage.setItem("currStreamId", data.id);

        await axios.post(`${baseAPI}/set-stream-status`, {
          hostID: currentUser,
          roomID: roomID,
          status: "true",
        });
        setStreamingStatus("true");
      } else {
        alert("Enter both title and description");
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const constraints = { video: isCameraOn, audio: isAudioOn };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();
  }, [isCameraOn, isAudioOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const toggleAudio = () => {
    setIsAudioOn((prevState) => !prevState);
  };

  useEffect(() => {
    if (type == "Host") {
      fetchStreamingStatus("get-stream-status-host");
    } else {
      fetchStreamingStatus("get-stream-status-guest");
    }
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="h-full ">
        {streamingStatus == "true" ? (
          <JoinRoom roomId={roomID} firstName={firstName} type={type} />
        ) : (
          <div className="h-full">
            {type == "Host" ? (
              <div className="w-full h-full text-secondary-content flex  justify-center  items-center ">
                {isCameraOn ? (
                  <div className="mx-5  h-6/6 w-4/12">
                    <h1 className="text-center my-5 text-xl">
                      Welcome, Enter stream details to create your room
                    </h1>

                    <video ref={videoRef} autoPlay playsInline />
                    <div className="my-5 flex justify-evenly items-center">
                      <Icon
                        component={isCameraOn ? VideocamIcon : VideocamOffIcon}
                        onClick={toggleCamera}
                        sx={{ fontSize: "30px" }}
                      />

                      <Icon
                        component={isAudioOn ? MicIcon : MicOffIcon}
                        onClick={toggleAudio}
                        sx={{ fontSize: "30px" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mx-5 my-5   flex-col justify-center items-center ">
                    <img
                      src={CartoonImage}
                      style={{ width: "300px" }}
                      className=""
                    />
                    <div className="my-5 flex justify-evenly items-center">
                      <Icon
                        component={isCameraOn ? VideocamIcon : VideocamOffIcon}
                        onClick={toggleCamera}
                        sx={{ fontSize: "30px" }}
                      />

                      <Icon
                        component={isAudioOn ? MicIcon : MicOffIcon}
                        onClick={toggleAudio}
                        sx={{ fontSize: "30px" }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-4/12 flex-col justify-center items-center">
                  <input
                    type="text"
                    value={title}
                    placeholder="Enter Stream Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="outline-none my-3 p-3 text-neutral"
                  />
                  <input
                    type="text"
                    value={description}
                    placeholder="Enter Stream Description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="outline-none my-3 p-3 text-neutral"
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleJoinStream}
                  >
                    Create room
                  </button>
                </div>
              </div>
            ) : (
              <Box className="w-full h-full flex flex-col justify-center items-center bg-primary">
                <h1 className="text-xl font-bold ">
                  UH Oh , There are no live streams at the moment please check
                  schedule or watch recorded lectures ..{" "}
                </h1>
                <Box className="flex flex-col w-full justify-evenly items-center bg-primary my-8">
                  <button
                    className="btn btn-secondary  btn-wide my-5"
                    onClick={() => dispatch(stateModifier("schedule"))}
                  >
                    View Schedule
                  </button>
                  <button
                    className="btn btn-secondary btn-wide my-5"
                    onClick={() => dispatch(stateModifier("uploads"))}
                  >
                    Recorded Lectures
                  </button>
                </Box>
              </Box>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Stream;
