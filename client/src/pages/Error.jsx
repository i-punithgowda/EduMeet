import { Box } from "@mui/material";
import React from "react";
import ErrorImage from "../assets/svg/Error.svg";
import { Link } from "react-router-dom";

function Error() {
  const ErrorMessages = [
    "Oh no! The Marauder's Map can't locate this page. It must be hidden with an Invisibility Spell.",
    "Accio Page! Unfortunately, the spell didn't work. The page you're seeking has eluded us.",
    "Muggles Beware: The page you're looking for is hidden with powerful enchantments known only to wizards.",
    "Error 404: This page has been snapped out of existence by Thanos. Perfectly balanced, as all things should be.",
    "Error 404: This page is trapped in the Quantum Realm with Ant-Man. We're working on a rescue mission.",
    "I am Groot! Translation: The page you're searching for is currently communicating in its own unique language.",
    "Error 404: Spider-Sense tingling! But even Spider-Man couldn't find this page.",
  ];

  return (
    <Box className="bg-neutral w-screen h-screen flex p-5 flex-col justify-center items-center">
      <Box className="404-error-image  w-96">
        <img src={ErrorImage} className="w-full" />
      </Box>
      <Box className="w-full">
        <p className="text-secondary-content font-bold text-center text-md">
          {ErrorMessages[Math.floor(Math.random() * 7)]}
        </p>
        <div className="w-full flex justify-center items-center my-5">
          <button className="btn btn-warning">
            <Link to="/">Go back</Link>
          </button>
        </div>
      </Box>
    </Box>
  );
}

export default Error;
