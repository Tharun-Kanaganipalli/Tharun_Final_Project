import React from "react";

interface DashboardTileProps {
  title: string;
  value: number;
  description: string;
}
function DashboardTile({ title, value, description }: DashboardTileProps) {
  return (
    <div className="bg-white p-4 rounded border border-gray-400 flex flex-col gap-5">
      <h3 className="text-sm font-bold text-gray-800 uppercase">{title}</h3>
      <p className="text-6xl font-bold text-gray-800 mt-2 text-center">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
}

export default DashboardTile;
