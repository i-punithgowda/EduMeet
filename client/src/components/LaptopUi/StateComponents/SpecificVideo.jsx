import { Box } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player/lazy";

function SpecificVideo({ url, title, description, date }) {
  return (
    <Box className="h-full flex justify-center items-center flex-col">
      <ReactPlayer
        url={`data:video/mp4;base64,${url}`}
        controls
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
          sharing: false,
        }}
      />
      <Box className="stream-details my-5 flex  w-full justify-between items-center">
        <Box className="basic w-56 ">
          <h1 className="text-xl"> {title}</h1>
          <h1 className="text-sm text-justify font-light"> {description}</h1>
        </Box>
        <Box className="date">
          <h1 className="text-xl"> {date}</h1>
        </Box>
      </Box>
    </Box>
  );
}

export default SpecificVideo;
