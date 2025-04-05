import { ISalon } from "@/interfaces";
import React from "react";
import { Input } from "./ui/input";
import { appointmentStatuses } from "@/constants";
import { Button } from "./ui/button";

interface IFiltersProps {
  salons: ISalon[];
  selectedSalon: string;
  setSelectedSalon: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  setFiltersCleared: (value: boolean) => void;
  fetchData: () => void;
}

function Filters({
  salons,
  selectedSalon,
  setSelectedSalon,
  date,
  setDate,
  selectedStatus,
  setSelectedStatus,
  setFiltersCleared,
  fetchData,
}: IFiltersProps) {
  return (
    <div className="grid grid-cols-4 gap-5 items-end">
      <div className="flex gap-1 flex-col">
        <h1 className="text-sm">Select Salon</h1>
        <select
          value={selectedSalon}
          onChange={(e) => setSelectedSalon(e.target.value)}
          className="w-full p-[10px] border border-gray-500 rounded-lg text-sm"
        >
          <option value="">All</option>
          {salons.map((salon) => (
            <option key={salon.id} value={salon.id} className="text-sm">
              {salon.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-sm">Select Date</h1>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex gap-1 flex-col">
        <h1 className="text-sm">Status</h1>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-[10px] border border-gray-500 rounded-lg text-sm"
        >
          <option value="">All</option>
          {appointmentStatuses.map((item) => (
            <option key={item.value} value={item.value} className="text-sm">
              {item.label}
            </option>
          ))}
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Button
          onClick={() => {
            setDate("");
            setSelectedSalon("");
            setFiltersCleared(true);
          }}
          variant={"outline"}
        >
          Clear Filters
        </Button>
        <Button onClick={fetchData}>Apply Filter</Button>
      </div>
    </div>
  );
}

export default Filters;
