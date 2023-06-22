import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;
  console.log("nenenenene", peer);

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on("track", (track, stream) => {});
  }, [peer]);

  return (
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
      <Video
        playsInline
        autoPlay
        ref={ref}
        style={{
          width: "250px",
          height: "250px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      />
      <span className="relative  bottom-12 text-sm text-secondary-content font-bold">
        {peer.firstName}
      </span>
    </Box>
  );
};

const Video = styled.video``;

export default VideoCard;
