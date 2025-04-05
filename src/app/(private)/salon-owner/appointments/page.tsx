"use client";
import {
  getAppointmentsOfSalonOwner,
  updateAppointmentStatus,
} from "@/actions/appointments";
import { getSalonsByOwnerId } from "@/actions/salons";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { IAppointment, ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Info from "@/components/info";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { appointmentStatuses } from "@/constants";
import dayjs from "dayjs";
import Filters from "@/components/filters";

function SalonOwnerAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<IAppointment[]>([]);
  const [salons = [], setSalons] = React.useState<ISalon[]>([]);
  const [date = "", setDate] = React.useState<string>("");
  const [selectedSalon = "", setSelectedSalon] = React.useState<string>("");
  const [selectedStatus = "", setSelectedStatus] = React.useState<string>("");
  const [loading = true, setLoading] = React.useState<boolean>(true);
  const [filtersCleared = false, setFiltersCleared] =
    React.useState<boolean>(false);
  const { user } = usersGlobalStore() as IUsersStore;
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response: any = await getAppointmentsOfSalonOwner({
        salonIds: selectedSalon ? [selectedSalon] : salons.map((s) => s.id),
        date,
        status: selectedStatus,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      setAppointments(response.data);
      setFiltersCleared(false);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response: any = await getSalonsByOwnerId(user.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setSalons(response.data);
    } catch (error) {
      toast.error("Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salons.length > 0) {
      fetchAppointments();
    }
  }, [salons]);

  const handleStatusChange = async (appointmentId: string, status: string) => {
    try {
      const response: any = await updateAppointmentStatus({
        id: appointmentId,
        status,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      const updatedAppointments: any = appointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            status,
          };
        }
        return appointment;
      });
      setAppointments(updatedAppointments);
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  useEffect(() => {
    if (filtersCleared) {
      fetchAppointments();
    }
  }, [filtersCleared]);

  useEffect(() => {
    fetchSalons();
  }, []);

  const columns = [
    "Salon Name",
    "Customer",
    "Date",
    "Start Time",
    "End Time",
    "Status",
    "Booked At",
    "Actions",
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="Appointments" />

      <Filters
        {...{
          salons,
          selectedSalon,
          setSelectedSalon,
          date,
          setDate,
          selectedStatus,
          setSelectedStatus,
          setFiltersCleared,
          fetchData: fetchAppointments,
        }}
      />
      {loading && <Spinner />}

      {!loading && appointments.length === 0 && (
        <Info message="No appointments found" />
      )}

      {!loading && appointments.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {columns.map((column, index) => (
                <TableHead key={index} className="font-bold">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.salon.name}</TableCell>
                <TableCell>{appointment.user.name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.start_time}</TableCell>
                <TableCell>{appointment.end_time}</TableCell>
                <TableCell>
                  <select
                    onChange={(e) =>
                      handleStatusChange(appointment.id, e.target.value)
                    }
                    value={appointment.status}
                    className="border border-gray-400 rounded px-2 py-1 text-sm"
                    disabled={
                      appointment.status === "cancelled" ||
                      appointment.status === "completed" ||
                      dayjs(appointment.date).isBefore(dayjs(), "day")
                    }
                  >
                    {appointmentStatuses.map((status, index) => (
                      <option key={index} value={status.value}>
                        {status.label}
                      </option>
                    ))}

                    <option value="completed">Completed</option>
                  </select>
                </TableCell>
                <TableCell>
                  {dayjs(appointment.created_at).format("MMM DD, YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                  <button className="text-red-800 underline capitalize cursor-pointer">
                    Cancel
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SalonOwnerAppointmentsPage;
