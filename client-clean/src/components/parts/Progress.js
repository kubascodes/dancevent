import React, { useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const Progress = ({ progress }) => {
  const [progressBar] = useState({ progressBar: progress });
  return <ProgressBar now={progressBar} />;
};

export default Progress;
