import { create } from "zustand";
import { IPlan } from "@/interfaces";

export const plansGlobalStore = create((set) => ({
  selectedPlan: null,
  setSelectedPlan: (plan: IPlan) => set({ selectedPlan: plan }),
  selectedPaymentOption: null,
  setSelectedPaymentOption: (option: string) =>
    set({ selectedPaymentOption: option }),
}));

export interface IPlansStore {
  selectedPlan: IPlan;
  setSelectedPlan: (plan: IPlan) => void;
  selectedPaymentOption: {
    label: string;
    amount: number;
    duration: number;
  };
  setSelectedPaymentOption: (option: any) => void;
}
