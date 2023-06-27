import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import socket from "../../socket";
import VideoCard from "../Video/VideoCard";
import BottomBar from "../BottomBar/BottomBar";
import Chat from "../Chat/Chat";
import PollIcon from "@mui/icons-material/Poll";
import { Box } from "@mui/material";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
import AlertSound from "../../assets/sounds/alert.mp3";

const Room = (props) => {
  const currentUser = sessionStorage.getItem("user");
  const audio = new Audio(AlertSound);
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const [displayChat, setDisplayChat] = useState(false);
  const [attendanceTaken, setAttendanceTaken] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showVideoDevices, setShowVideoDevices] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuestionID, setCurrentQuestionID] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollRecieved, setPollRecieved] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState("");
  const [pollQuestions, setPollQuestions] = useState([]);
  const [showPollQuestions, setshowPollQuestions] = useState(false);
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
    let data = [];

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      const audio = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const combine = new MediaStream([
        ...stream.getTracks(),
        ...audio.getTracks(),
      ]);

      const recorder = new MediaRecorder(combine);
      recorder.ondataavailable = (e) => {
        data.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(data, { type: "video/mp4" });
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("streamId", currentStreamId);

        try {
          const response = await fetch(`${baseAPI}/save-video`, {
            method: "POST",
            body: formData,
          });

          const responseData = await response.json();
          if (responseData.status) {
            await axios.put(`${baseAPI}/end-stream`, {
              id: currentStreamId,
              video_url: responseData.video_url,
            });

            await axios.put(`${baseAPI}/update-stream-status`, {
              hostID: currentUser,
            });

            socket.emit("end-stream", {
              roomId: roomId,
            });
          }
        } catch (error) {
          console.error(error);
        }
      };

      setMediaRecorder(recorder);
      mediaStreamRef.current = recorder;

      recorder.start();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStreamStop = async () => {
    mediaStreamRef.current.stop();
  };

  const handleAttendance = () => {
    socket.emit("get-all-users", {
      roomId: roomId,
    });
  };

  const handlePolls = () => {
    const questionID = uuidv4();
    // console.log("hiihihi", questionID);
    const question = window.prompt("Enter a question");
    const nOptions = window.prompt("Enter total number of options");
    const options = [];
    for (var i = 0; i < nOptions; i++) {
      options.push(window.prompt(`Enter Option ${i + 1}`));
    }
    console.log("question : " + question);
    console.log(options);

    if (question != null && options.length > 0) {
      socket.emit("create-poll", {
        questionID: questionID,
        roomId: roomId,
        currentQuestion: question,
        pollOptions: options,
      });
    }
  };

  const handlePollSubmit = () => {
    if (selectedPollOption.length > 0) {
      socket.emit("poll-submit", {
        roomId: roomId,
        currentUser: currentUser,
        question: currentQuestion,
        selectedPollOption: selectedPollOption,
        questionID: currentQuestionID,
      });
      setSelectedPollOption("");
      setPollRecieved(false);
      setCurrentQuestionID("");
      setCurrentQuestion("");
      setPollOptions("");
      audio.pause();
      audio.currentTime = 0;
      //console.log(selectedPollOption, currentQuestionID);
    }
  };

  const getPollQuestions = () => {
    socket.emit("get-poll-questions", {
      roomId: roomId,
    });
  };

  const fetchPollResults = (questionID) => {
    console.log(questionID);
    socket.emit("get-poll-results", {
      roomId: roomId,
      questionID: questionID,
    });
    setshowPollQuestions(false);
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

    socket.on(
      "poll-recieved",
      ({ currentQuestion, pollOptions, questionID }) => {
        setPollRecieved(true);
        setCurrentQuestionID(questionID);
        audio.play();
        console.log("poll recieved , type : " + type);
        console.log("question ID : " + currentQuestion);
        if (type == "Guest") {
          //          alert(`poll recieved`);
          setCurrentQuestion(currentQuestion);
          setPollOptions(pollOptions);
        }
      }
    );

    socket.on("poll-questions", (questions) => {
      const questionsArray = [];
      questions.map((result) => {
        questionsArray.push({
          question: result.question,
          questionID: result.questionID,
        });
      });

      console.log(questionsArray);
      setPollQuestions(questionsArray);
      setshowPollQuestions(true);
    });

    socket.on("poll-results", (results) => {
      console.log(results);
      if (type == "Host") {
        alert(
          `Result of poll : ${results[0].question} is : ${JSON.stringify(
            results[0].options
          )}`
        );
      }
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
              >
                <video
                  playsInline
                  autoPlay
                  style={{ height: "300px", width: "100%" }}
                  ref={userVideoRef}
                  onClick={expandScreen}
                />
                <span className="relative  bottom-12 text-2xl text-secondary-content font-bold">
                  {firstName}
                  <span className="text-sm">(Host)</span>
                </span>
                <Box>
                  <button
                    className="btn btn-secondary"
                    onClick={getPollQuestions}
                  >
                    Get Poll Questions
                  </button>
                </Box>
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

                  <Tooltip title="Live Polls">
                    <span
                      onClick={handlePolls}
                      className={`p-3 bg-accent rounded-full mx-3`}
                    >
                      <Icon
                        component={PollIcon}
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      />
                    </span>
                  </Tooltip>
                </Box>
              ) : null}

              {pollRecieved == true && type == "Guest" ? (
                <div class="fixed inset-0 flex items-center justify-center z-50">
                  <div className="mockup-code ">
                    <pre data-prefix="#">
                      <code>{roomId} has a new poll</code>
                    </pre>
                    <pre data-prefix=">" className="text-warning">
                      {currentQuestion}
                    </pre>
                    <pre className="text-warning w-full flex flex-col justify-center items-center ">
                      {pollOptions.length > 0
                        ? pollOptions.map((option) => {
                            return (
                              <Box key={option} className="flex">
                                <input
                                  type="radio"
                                  name="poll-option"
                                  value={option}
                                  onChange={(e) => {
                                    setSelectedPollOption(e.target.value);
                                  }}
                                />
                                <label>{option}</label>
                              </Box>
                            );
                          })
                        : null}
                    </pre>
                    <pre className="w-full flex  justify-center items-center">
                      <button
                        onClick={handlePollSubmit}
                        className="btn btn-warning"
                      >
                        Submit answer
                      </button>
                    </pre>
                  </div>
                </div>
              ) : null}

              {pollQuestions.length > 0 &&
              type == "Host" &&
              showPollQuestions == true ? (
                <div class="fixed inset-0 flex items-center justify-center z-50">
                  <div className="mockup-code ">
                    <pre data-prefix="#">
                      <code>{roomId}'s Questions</code>
                    </pre>
                    <pre className="text-warning w-full flex flex-col justify-center items-center ">
                      {pollQuestions.length > 0
                        ? pollQuestions.map((question) => {
                            return (
                              <Box
                                key={question.questionID}
                                className="flex w-full text-center justify-center items-center bg-secondary"
                                onClick={() =>
                                  fetchPollResults(question.questionID)
                                }
                              >
                                <span className="w-full  text-secondary-content">
                                  {question.question}
                                </span>
                              </Box>
                            );
                          })
                        : null}
                    </pre>
                  </div>
                </div>
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
