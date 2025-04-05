import React from "react";

function Info({ message }: { message: string }) {
  return <div className="p-5 bg-gray-100 border text-sm mt-7 rounded font-medium">{message}</div>;
}

export default Info;
