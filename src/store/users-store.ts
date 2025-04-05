
import { IUser } from "@/interfaces";
import { create } from "zustand";

export const usersGlobalStore = create((set) => ({
  user: null,
  setUser: (user: IUser) => set({ user }),
}));

export interface IUsersStore {
  user: IUser;
  setUser: (user: IUser) => void;
}
