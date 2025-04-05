"use client";
import {
  getAppointmentsByUser,
  updateAppointmentStatus,
} from "@/actions/appointments";
import { IAppointment } from "@/interfaces";
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
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import Info from "@/components/info";
import { appointmentStatuses, ratings } from "@/constants";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitNewReview } from "@/actions/reviews";
import dayjs from "dayjs";

function UserAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<IAppointment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openReviewDialog, setOpenReviewDialog] =
    React.useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<IAppointment | null>(null);

  const [rating, setRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [submittingReview, setSubmittingReview] =
    React.useState<boolean>(false);

  const { user } = usersGlobalStore() as IUsersStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAppointmentsByUser(user.id);
      if (!response.success) {
        throw new Error(response.message);
      }
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

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

  const handleReviewSubmit = async () => {
    try {
      setSubmittingReview(true);
      const payload = {
        user_id: user.id,
        salon_id: selectedAppointment?.salon.id,
        appointment_id: selectedAppointment?.id,
        rating,
        comment,
      };
      const response: any = await submitNewReview(
        payload,
        (selectedAppointment!.salon.average_rating + rating) /
          (selectedAppointment!.salon.total_reviews + 1),
        selectedAppointment!.salon.total_reviews + 1
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success(response.message);
      setAppointments(
        appointments.map((appointment) => {
          if (appointment.id === selectedAppointment?.id) {
            return {
              ...appointment,
              is_review_given: true,
            };
          }
          return appointment;
        })
      );
      setOpenReviewDialog(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    "Salon Name",
    "Date",
    "Start Time",
    "End Time",
    "Status",
    "Booked At",
    "Actions",
  ];

  return (
    <div>
      <PageTitle title="My Appointments" />

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
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.start_time}</TableCell>
                <TableCell>{appointment.end_time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{dayjs(appointment.created_at).format("MMM DD, YYYY hh:mm A")}</TableCell>
                <TableCell className="flex gap-5">
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
                  </select>

                  {!appointment.is_review_given && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setOpenReviewDialog(true);
                      }}
                      className="text-gray-600 underline"
                    >
                      Review
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {openReviewDialog && (
        <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogHeader>
                <DialogTitle>
                  Review {selectedAppointment?.salon.name}
                </DialogTitle>
              </DialogHeader>
            </DialogHeader>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h1 className="text-sm">Rating</h1>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-400 rounded px-2 py-1 text-sm w-full h-9"
                >
                  <option value={0}>Select Rating</option>
                  {ratings.map((rating, index) => (
                    <option key={index} value={rating.value}>
                      {rating.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="text-sm">Comment</h1>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment"
                />
              </div>

              <div className="flex justify-end gap-5">
                <Button
                  onClick={() => setOpenReviewDialog(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  disabled={rating === 0 || comment === "" || submittingReview}
                  onClick={handleReviewSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UserAppointmentsPage;
