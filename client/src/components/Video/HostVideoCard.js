import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
const HostVideoCard = (props) => {
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
        style={{ height: "300px", width: "100%" }}
        ref={ref}
      />
      <span className="relative  bottom-12 text-2xl text-secondary-content font-bold">
        {peer.firstName}
        <span className="text-sm">(Host)</span>
      </span>
    </Box>
  );
};

const Video = styled.video``;

export default HostVideoCard;
