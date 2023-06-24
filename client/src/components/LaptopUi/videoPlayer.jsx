import React from "react";

const VideoPlayer = ({ thumbnail }) => {
  return (
    <video
      width="100%"
      url=""
      height="auto"
      poster={`data:image/png;base64,${thumbnail}`}
    />
  );
};

export default VideoPlayer;
