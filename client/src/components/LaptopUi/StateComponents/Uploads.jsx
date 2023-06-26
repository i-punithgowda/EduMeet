import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField } from "@mui/material";
import VideoPlayer from "../videoPlayer";
import { formatDistanceToNow } from "date-fns";
import SpecificVideo from "./SpecificVideo";
import { CommentSection } from "./Comments/CommentSection";
import Loading from "../../Loading";

function Uploads({ type, email, firstName, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("view");
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState("");
  const [query, setQuery] = useState("");
  const [commentsData, setCommentsData] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const baseAPI = process.env.REACT_APP_BASEAPI;

  const fetchHostVideo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-host-videos/${currentUser}`
      );
      console.log(data);
      setVideoList(data);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchGuestVideo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-guest-videos/${currentUser}`
      );
      console.log(data);
      setVideoList(data);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchComments = async (streamID) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-comments-replies/${streamID}`
      );
      setCommentsData(data);
      console.log(data);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleOpenVideo = async (streamID) => {
    try {
      setState("play");
      setLoading(true);
      const { data } = await axios.get(
        `${baseAPI}/get-specific-video/${streamID}`
      );
      console.log(data);

      setCurrentPlaying(data.videoInfo[0]);
      setCurrentPlayingUrl(data.videoFile);
      fetchComments(streamID);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    if (type == "Host") {
      fetchHostVideo();
    } else {
      fetchGuestVideo();
    }
  }, []);

  const handlePostComment = async () => {
    try {
      const obj = {
        userID: currentUser,
        streamID: currentPlaying.id,
        commentText: query,
        timeStamp: Date.now(),
      };
      //console.log(obj);
      const { data } = await axios.post(`${baseAPI}/post-comment`, obj);
      console.log(data);
      fetchComments(currentPlaying.id);
      setQuery("");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (state == "view") {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Box className="w-full h-full  flex justify-center items-center flex-col">
          <h1 className="text-2xl font-bold">Recorded Lectures</h1>
          <Box className="w-11/12 h-4/6 my-8 overflow-x-auto flex justify-center items-start">
            {videoList.length > 0 ? (
              <div className="flex flex-wrap justify-center items-start ">
                {videoList.map((video) => {
                  const date = new Date(parseInt(video.date));
                  const daysAgo = formatDistanceToNow(date, {
                    addSuffix: true,
                  });
                  //console.log(daysAgo);
                  return (
                    <div
                      className="w-72 bg-secondary-content h-56 mx-8 my-4 rounded-xl p-3 cursor-pointer"
                      key={video.id}
                      onClick={() => handleOpenVideo(video.stream_id)}
                    >
                      <VideoPlayer thumbnail={video.thumbnail} />
                      <h1 className="text-center ">{video.title}</h1>
                      <p className="text-center">{daysAgo}</p>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </Box>
        </Box>
      );
    }
  } else {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Box className="h-full w-full  flex justify-center items-center">
          <Box className="main-container w-full h-full flex justify-center items-center">
            <Box className="video-container w-8/12 h-full flex justify-center items-center flex-col bg-base-200">
              <Box className="menu w-full  ml-5 my-8">
                <span className="">
                  {" "}
                  &lt; Videos -&gt; {currentPlaying.title}{" "}
                </span>
              </Box>
              <SpecificVideo
                url={currentPlayingUrl}
                title={currentPlaying.title}
                description={currentPlaying.description}
                date={currentPlaying.date}
              />
            </Box>
            <Box className="query-container w-6/12 h-full p-5 flex flex-col">
              <Box className="query-header w-full h-1/6 flex flex-col justify-around items-center">
                <Box className="w-full text-left">
                  Queries{" "}
                  <span className="bg-secondary-content px-2  rounded-md">
                    {commentsData.length}
                  </span>
                </Box>
              </Box>

              <Box className="query-list h-5/6 overflow-auto">
                <CommentSection
                  commentsData={commentsData}
                  fetchComments={fetchComments}
                  currentUser={currentUser}
                  streamID={currentPlaying.id}
                />
              </Box>

              <Box className="query-value w-full flex flex-col justify-center items-center  ">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Your Query.."
                  className="w-full p-3 rounded-xl border-2 outline-none my-3"
                />{" "}
                <Box className="w-full flex justify-start items-center">
                  <button
                    className="btn btn-secondary btn-large"
                    onClick={handlePostComment}
                  >
                    Post comment
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
  }
}

export default Uploads;
