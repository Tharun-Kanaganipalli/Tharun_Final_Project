"use client";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import dayjs from "dayjs";
import React from "react";

function ProfileCard() {
  const { user } = usersGlobalStore() as IUsersStore;

  const renderProperty = (label: string, value: string) => (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="text-gray-800 text-sm font-bold">{value}</span>
    </div>
  );

  return (
    <div className="profile-card p-5 border border-gray-300 grid grid-cols-3 gap-5 mt-7 rounded-sm">
      {renderProperty("Name", user.name)}
      {renderProperty("Email", user.email)}
      {renderProperty("ID", user.id)}
      {renderProperty("Role", user.role.toUpperCase())}
      {renderProperty(
        "Joined At",
        dayjs(user.created_at).format("MMM DD, YYYY hh:mm A")
      )}
    </div>
  );
}

export default ProfileCard;
