"use server";

import supabase from "@/config/supabase-client-config";

export const bookNewAppointment = async (data: any) => {
  try {
    const { error } = await supabase.from("appointments").insert([data]);
    if (error) {
      throw error;
    }
    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to book appointment",
    };
  }
};

export const getAppointmentsByUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("* , salons(name , id , average_rating , total_reviews)")
      .eq("user_id", userId).order("created_at" , {ascending : false});

    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data.map((appointment: any) => ({
        ...appointment,
        salon: appointment.salons,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch appointments",
    };
  }
};

export const getAppointmentsOfSalonOwner = async ({
  salonIds,
  date,
  status,
}: {
  salonIds: string[];
  date: string;
  status: string;
}) => {
  try {
    let qry = supabase
      .from("appointments")
      .select("* , salons(id , name) , user_profiles(name)")
      .in("salon_id", salonIds).order("created_at" , {ascending : false});
    if (date) {
      qry = qry.eq("date", date);
    }
    if (status) {
      qry = qry.eq("status", status);
    }

    const { data, error } = await qry;
    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data.map((appointment: any) => ({
        ...appointment,
        salon: appointment.salons,
        user: appointment.user_profiles,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch appointments",
    };
  }
};

export const getAppointmentAvailability = async ({
  salonId,
  date,
  time,
  maxSlots,
}: {
  salonId: string;
  date: string;
  time: string;
  maxSlots: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("salon_id", salonId)
      .eq("date", date)
      .eq("start_time", time);

    if (error) {
      throw error;
    }

    if (data.length >= maxSlots) {
      return {
        success: false,
        message: "Slot not available",
      };
    }

    return {
      success: true,
      message: "Slot available",
      availableSlots: maxSlots - data.length,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to check availability",
    };
  }
};

export const updateAppointmentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);
    if (error) {
      throw error;
    }
    return {
      success: true,
      message: "Appointment status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update appointment status",
    };
  }
};
