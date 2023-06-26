import { Box } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player/lazy";

function SpecificVideoMobile({ url, title, description, date }) {
  return (
    <Box className="h-full w-full flex justify-center items-center flex-col text-secondary-content p-5">
      <Box className="xs:w-6/12">
        <video src={`data:video/mp4;base64,${url}`} controls />{" "}
      </Box>
      <Box className="stream-details my-5 flex flex-col  w-full justify-between items-center">
        <h1 className="text-xl my-2"> {title}</h1>
        <h1 className="text-sm text-justify font-light my-2 font-bold">
          {" "}
          {description}
        </h1>
        <h1 className="text-xl my-2"> {date}</h1>
      </Box>
    </Box>
  );
}

export default SpecificVideoMobile;
