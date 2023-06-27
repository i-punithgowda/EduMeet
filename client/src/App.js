import React from "react";
import Main from "./components/Main/Main";
import Room from "./components/Room/Room";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Additional from "./pages/Additional";
import Verification from "./pages/Verification";
import Panel from "./pages/Dashboard";
import Verify from "./pages/Verify";
import Error from "./pages/Error";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/join" element={<Main />} />
        <Route exact path="/room/:roomId" element={<Room />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/additional" element={<Additional />} />
        <Route exact path="/verification" element={<Verification />} />
        <Route exact path="/verify/:email" element={<Verify />} />
        <Route exact path="/dashboard" element={<Panel />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
`;

export default App;
