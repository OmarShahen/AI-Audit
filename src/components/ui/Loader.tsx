import React from "react";
import { ClipLoader } from "react-spinners";

const CircularLoading = () => {
  return (
    <div className="flex justify-center items-center h-32">
      <ClipLoader color="#607AFB" size={35} />
    </div>
  );
};

export default CircularLoading;
