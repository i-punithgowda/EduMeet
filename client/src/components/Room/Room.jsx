import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import socket from "../../socket";
import VideoCard from "../Video/VideoCard";
import BottomBar from "../BottomBar/BottomBar";
import Chat from "../Chat/Chat";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import axios from "axios";
import HostVideoCard from "../Video/HostVideoCard";
import BackHandIcon from "@mui/icons-material/BackHand";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";
import { Icon } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { stateModifier } from "../../features/reducers/state-slice";
import RecordRTC from "recordrtc";

const Room = (props) => {
  const currentUser = sessionStorage.getItem("user");
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showVideoDevices, setShowVideoDevices] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  const roomId = props.roomId;
  const baseAPI = process.env.REACT_APP_BASEAPI;
  const firstName = props.firstName;
  const type = props.type;
  const currentStreamId = localStorage.getItem("currStreamId");
  const dispatch = useDispatch();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const mediaStreamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  let recordedChunks = [];
  const [recordedVideo, setRecordedVideo] = useState(null);

  const startRecording = async () => {
    if (type === "Host") {
      try {
        if (recording == false) {
          setRecording(true);
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });

          mediaStreamRef.current = screenStream;

          recordedChunks = [];

          let recorder = RecordRTC(screenStream, {
            type: "video",
            mimeType: "video/webm",
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
          });
          setMediaRecorder(recorder);

          recorder.startRecording();
          console.log("Recording started");
        }
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const handleStreamStop = async () => {
    mediaRecorder.stopRecording(() => {
      const blob = mediaRecorder.getBlob();
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("streamId", currentStreamId);
      fetch(`${baseAPI}/save-video`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.status == true) {
            await axios.put(`${baseAPI}/end-stream`, {
              id: currentStreamId,
              video_url: data.video_url,
            });

            await axios.put(`${baseAPI}/update-stream-status`, {
              hostID: currentUser,
            });

            socket.emit("end-stream", {
              roomId: roomId,
            });
          }
        });
    });
  };

  const handleAttendance = () => {
    socket.emit("get-all-users", {
      roomId: roomId,
    });
  };

  useEffect(() => {
    // Get Video Devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const filtered = devices.filter((device) => device.kind === "videoinput");
      setVideoDevices(filtered);
    });

    // Set Back Button Event
    window.addEventListener("popstate", goToBack);

    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;

        socket.emit("BE-join-room", {
          roomId,
          userName: currentUser,
          firstName: firstName,
          type: type,
        });
        socket.on("FE-user-join", (users) => {
          // all users
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, video, audio, firstName, type } = info;

            if (userName !== currentUser) {
              const peer = createPeer(
                userId,
                socket.id,
                stream,
                firstName,
                type
              );

              peer.userName = userName;
              peer.peerID = userId;
              peer.firstName = firstName;
              peer.type = type;
              console.log("afasdf", peer);

              peersRef.current.push({
                peerID: userId,
                peer,
                userName,
                firstName,
                type,
              });
              peers.push(peer);

              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on("FE-receive-call", ({ signal, from, info }) => {
          let { userName, video, audio, firstName, type } = info;
          const peerIdx = findPeer(from);

          if (!peerIdx) {
            const peer = addPeer(signal, from, stream);

            peer.userName = userName;
            peer.firstName = firstName;
            peer.type = type;
            console.log(peer.userName);

            peersRef.current.push({
              peerID: from,
              peer,
              userName: userName,
              firstName: firstName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on("FE-call-accepted", ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on("FE-user-leave", ({ userId, userName }) => {
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
          peersRef.current = peersRef.current.filter(
            ({ peerID }) => peerID !== userId
          );
        });
      });

    socket.on("all-users", async (users) => {
      // Handle the list of users received
      const usersArray = [];
      users.forEach((user) => {
        usersArray.push({ userID: user.userName });
      });

      try {
        await axios.post(`${baseAPI}/save-attendance`, {
          users: usersArray,
          streamID: currentStreamId,
        });
        setAttendanceTaken(true);
      } catch (err) {
        alert(err.response.data.message);
      }
    });

    socket.on("stream-ended", () => {
      alert("Stream ended, you can get stream recordings in uploads section");

      dispatch(stateModifier("uploads"));
    });

    socket.on("FE-toggle-camera", ({ userId, switchTarget }) => {
      const peerIdx = findPeer(userId);

      setUserVideoAudio((preList) => {
        let video = preList[peerIdx.userName].video;
        let audio = preList[peerIdx.userName].audio;

        if (switchTarget === "video") video = !video;
        else audio = !audio;

        return {
          ...preList,
          [peerIdx.userName]: { video, audio },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const fetchuserName = async (val) => {
    try {
      const { data } = await axios.get(`${baseAPI}/get-user/${val}`);
    } catch (err) {
      alert(err.data.response.message);
    }
  };

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on("disconnect", () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-accept-call", { signal, to: callerId });
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    if (peer.type == "Guest") {
      return (
        <Box
          className={`width-peer${peers.length > 8 ? "" : peers.length}`}
          onClick={expandScreen}
          key={index}
        >
          {writeUserName(peer.userName)}
          <VideoCard key={index} peer={peer} number={arr.length} />
        </Box>
      );
    }
  }

  function createHostVideo(peer, index, arr) {
    console.log("peer type host : ", peer);
    if (peer.type == "Host") {
      return (
        <Box onClick={expandScreen} sx={{ width: "100%" }}>
          <HostVideoCard key={index} peer={peer} number={arr.length} />
        </Box>
      );
    }
  }

  function writeUserName(userName, index) {
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <UserName key={userName}>{userName}</UserName>;
      }
    }
  }

  // Open Chat
  const clickChat = (e) => {
    e.stopPropagation();
    setDisplayChat(!displayChat);
  };

  // BackButton
  const goToBack = (e) => {
    e.preventDefault();
    socket.emit("BE-leave-room", { roomId, leaver: currentUser });
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute("data-switch");

    setUserVideoAudio((preList) => {
      let videoSwitch = preList["localUser"].video;
      let audioSwitch = preList["localUser"].audio;

      if (target === "video") {
        const userVideoTrack =
          userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack =
          userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: target });
  };

  const clickScreenSharing = () => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((stream) => {
          const screenTrack = stream.getTracks()[0];

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              screenTrack,
              userStream.current
            );
          });

          // Listen click end
          screenTrack.onended = () => {
            peersRef.current.forEach(({ peer }) => {
              peer.replaceTrack(
                screenTrack,
                peer.streams[0]
                  .getTracks()
                  .find((track) => track.kind === "video"),
                userStream.current
              );
            });
            userVideoRef.current.srcObject = userStream.current;
            setScreenShare(false);
          };

          userVideoRef.current.srcObject = stream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  const expandScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const clickBackground = () => {
    if (!showVideoDevices) return;

    setShowVideoDevices(false);
  };

  const clickCameraDevice = (event) => {
    if (
      event &&
      event.target &&
      event.target.dataset &&
      event.target.dataset.value
    ) {
      const deviceId = event.target.dataset.value;
      const enabledAudio =
        userVideoRef.current.srcObject.getAudioTracks()[0].enabled;

      navigator.mediaDevices
        .getUserMedia({ video: { deviceId }, audio: enabledAudio })
        .then((stream) => {
          const newStreamTrack = stream
            .getTracks()
            .find((track) => track.kind === "video");
          const oldStreamTrack = userStream.current
            .getTracks()
            .find((track) => track.kind === "video");

          userStream.current.removeTrack(oldStreamTrack);
          userStream.current.addTrack(newStreamTrack);

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              oldStreamTrack,
              newStreamTrack,
              userStream.current
            );
          });
        });
    }
  };

  return (
    <Box
      onClick={clickBackground}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
      className="bg-base-200"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "100%",
          width: "70%",
          flexDirection: "column",
        }}
      >
        <Box className="main-stream-container w-full h-full ">
          <Box className="guest-container w-full overflow-auto h-2/6  flex">
            {peers &&
              peers.map((peer, index, arr) =>
                createUserVideo(peer, index, arr)
              )}
          </Box>
          <Box className="host-container w-full overflow-auto h-3/6  flex justify-center items-center ">
            {peers &&
              peers.map((peer, index, arr) =>
                createHostVideo(peer, index, arr)
              )}

            {type == "Host" ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
                onClick={expandScreen}
              >
                <video
                  playsInline
                  autoPlay
                  style={{ height: "300px", width: "100%" }}
                  ref={userVideoRef}
                />
                <span className="relative  bottom-12 text-2xl text-secondary-content font-bold">
                  {firstName}
                  <span className="text-sm">(Host)</span>
                </span>
              </Box>
            ) : null}
          </Box>

          <Box className="w-full flex h-1/6">
            {type !== "Host" ? (
              <Box className="relative  ">
                <video
                  style={{ width: "200px", borderRadius: "12px" }}
                  onClick={expandScreen}
                  ref={userVideoRef}
                  autoPlay
                  playInline
                ></video>
                <span className="relative  bottom-8 px-4 text-center text-sm text-secondary-content font-bold">
                  You
                </span>
              </Box>
            ) : null}

            <Box className="controls w-full   flex justify-center items-center ">
              <Tooltip title="Camera">
                <span className="p-3 bg-accent rounded-full mx-3">
                  <Icon
                    component={CameraAltOutlinedIcon}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  />
                </span>
              </Tooltip>
              <Tooltip title="Mic">
                <span
                  onClick={toggleCameraAudio}
                  className="p-3 bg-accent rounded-full mx-3"
                >
                  <Icon
                    component={MicNoneOutlinedIcon}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  />
                </span>
              </Tooltip>
              <Tooltip title="Share screen">
                <span
                  onClick={clickScreenSharing}
                  className="p-3 bg-accent rounded-full mx-3"
                >
                  <Icon
                    component={ScreenShareOutlinedIcon}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  />
                </span>
              </Tooltip>
              {type == "Host" ? (
                <Box>
                  <Tooltip title="Recording">
                    <span
                      onClick={startRecording}
                      className={`p-3 ${
                        recording ? "bg-base-300" : "bg-accent"
                      } rounded-full mx-3`}
                    >
                      <Icon
                        component={RadioButtonCheckedIcon}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      />
                    </span>
                  </Tooltip>

                  <Tooltip title="End Stream">
                    <span
                      onClick={handleStreamStop}
                      className="p-3 bg-accent rounded-full mx-3 "
                    >
                      <Icon
                        component={CallEndOutlinedIcon}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      />
                    </span>
                  </Tooltip>

                  <Tooltip title="Attendance">
                    <span
                      onClick={handleAttendance}
                      className={`p-3 ${
                        attendanceTaken ? "bg-base-300" : "bg-accent"
                      } rounded-full mx-3`}
                    >
                      <Icon
                        component={BackHandIcon}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      />
                    </span>
                  </Tooltip>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
      <Chat display={displayChat} roomId={roomId} firstName={firstName} />
    </Box>
  );
};

const UserName = styled.div`
  position: absolute;
  font-size: calc(20px + 5vmin);
  z-index: 1;
`;

export default Room;
