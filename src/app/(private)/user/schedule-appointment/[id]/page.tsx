"use client";
import {
  bookNewAppointment,
  getAppointmentAvailability,
} from "@/actions/appointments";
import { getSalonById } from "@/actions/salons";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
const dayjs = require("dayjs");
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SecheduleAppointmentCheckout() {
  const [salon, setSalon] = React.useState<ISalon | null>(null);
  const [date, setDate] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<string>("");
  const { user } = usersGlobalStore() as IUsersStore;
  const [bookingAppointment, setBookingAppointment] = React.useState(false);
  const [loading = true, setLoading] = React.useState<boolean>(true);
  const [availabilty, setAvailabilty] = React.useState<any>({
    available: false,
    message: "",
    count: 0,
  });
  const router = useRouter();
  const params: any = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSalonById(params?.id!);
      if (response.success) {
        setSalon(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch salon details");
    } finally {
      setLoading(false);
    }
  };

  const checkAvaialbility = async () => {
    try {
      const response = await getAppointmentAvailability({
        salonId: salon?.id!,
        date,
        time: startTime,
        maxSlots: salon?.max_bookings_per_slot || 0,
      });
      if (response.success) {
        setAvailabilty({
          available: response.success,
          message: response.message,
          count: response.availableSlots || 0,
        });
      } else {
        setAvailabilty({
          available: response.success,
          message: response.message,
          count: 0,
        });
      }
    } catch (error) {
      toast.error("Failed to check availability");
    }
  };

  const renderProperty = (label: string, value: any) => {
    return (
      <div className="flex justify-between">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    );
  };

  const bookAppointmentHandler = async () => {
    try {
      setBookingAppointment(true);
      const payload = {
        user_id: user?.id,
        salon_id: salon?.id,
        date,
        start_time: startTime,
        end_time: dayjs(`${date} ${startTime}`)
          .add(salon?.slot_duration || 0, "minute")
          .format("HH:mm"),
        status: "booked",
      };

      const response = await bookNewAppointment(payload);
      toast.success(response.message);
      router.push("/user/appointments");
    } catch (error) {
      toast.error("Failed to book appointment");
    } finally {
      setBookingAppointment(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (date && startTime) {
      checkAvaialbility();
    }
  }, [date, startTime]);

  const slots = useMemo(() => {
    let slotsTemp: string[] = [];
    if (salon) {
      const sampleDate = dayjs().format("YYYY-MM-DD");
      let temp = dayjs(`${sampleDate} ${salon.start_time}`);
      const endTime = dayjs(`${sampleDate} ${salon.end_time}`);

      while (temp.isBefore(endTime)) {
        slotsTemp.push(temp.format("HH:mm"));
        temp = temp.add(salon.slot_duration || 0, "minute");
      }

      const breakStartTime = dayjs(`${sampleDate} ${salon.break_start_time}`);
      const breakEndTime = dayjs(`${sampleDate} ${salon.break_end_time}`);

      slotsTemp = slotsTemp.filter((slot) => {
        if (
          dayjs(`${sampleDate} ${slot}`).isBetween(
            breakStartTime,
            breakEndTime,
            null,
            "[]"
          ) ||
          dayjs(`${sampleDate} ${slot}`) === breakStartTime
        ) {
          return false;
        }

        return true;
      });
    }
    return slotsTemp;
  }, [JSON.stringify(salon)]);

  return (
    <div className="flex flex-col">
      <PageTitle title={`Schedule Appointment for ${salon?.name}`} />

      {loading && <Spinner parentHeight={120} />}

      {salon && (
        <div className="grid grid-cols-3 gap-10 mt-7">
          <div className="flex flex-col gap-2 p-5 border border-gray-400 rounded col-span-2">
            {renderProperty("Address", salon?.address)}
            {renderProperty("City", salon?.city)}
            {renderProperty("State", salon?.state)}
            {renderProperty("Zip", salon?.zip)}
            {renderProperty(
              "Minimum Service Price",
              `$${salon?.minimum_service_price}`
            )}
            {renderProperty(
              "Maximum Service Price",
              `$${salon?.maximum_service_price}`
            )}
            {renderProperty("Offer Status", salon?.offer_status)}
          </div>

          <div className="flex flex-col gap-5 p-5 border border-gray-400 rounded">
            <div>
              <h1 className="text-sm">Select Date</h1>
              <DatePicker
                selected={date ? new Date(date) : null}
                onChange={(date: any) => setDate(dayjs(date).format("YYYY-MM-DD"))}
                dateFormat="yyyy-MM-dd"
                className="border border-gray-300 rounded p-2 text-sm w-full"
                minDate={new Date()}
                disabled={bookingAppointment}
                filterDate={(date) => {
                  const day = dayjs(date).format("dddd").toLowerCase();
                  return salon?.working_days.includes(day);
                }}
              />
            </div>

            <div>
              <h1 className="text-sm">Select Time</h1>
              <select
                className="border border-gray-300 rounded p-2  text-sm w-full"
                onChange={(e) => setStartTime(e.target.value)}
                disabled={
                  !date ||
                  !salon?.working_days.includes(
                    dayjs(date).format("dddd").toLowerCase()
                  )
                }
              >
                <option value="">Select Start Time</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {availabilty.message && (
              <div>
                {availabilty.available ? (
                  <p className="text-green-500 text-sm">
                    {availabilty.message} ({availabilty.count} slots available)
                  </p>
                ) : (
                  <p className="text-red-700 text-sm">{availabilty.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-5">
              <Button variant={"default"} onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                disabled={
                  bookingAppointment ||
                  !date ||
                  !startTime ||
                  !availabilty.available
                }
                onClick={bookAppointmentHandler}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecheduleAppointmentCheckout;
