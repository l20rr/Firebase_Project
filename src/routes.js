import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import SendEmail from "./SendEmail";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<App/>} />
      <Route path="/email" element={<SendEmail />} />
      <Route path="*" element={<App/>} />

    </Routes>
  );
};

export default Routers;