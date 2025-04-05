import React from "react";

function Spinner({ parentHeight = 100 }: { parentHeight?: number }) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: parentHeight }}
    >
      <div className="w-10 h-10 border-8 border-primary animate-spin border-t-gray-200 rounded-full"></div>
    </div>
  );
}

export default Spinner;
