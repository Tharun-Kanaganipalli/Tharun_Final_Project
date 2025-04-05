"use client";
import { getDashboardData } from "@/actions/dashboard";
import { getSalonsByOwnerId } from "@/actions/salons";
import DashboardTile from "@/components/dashboard-tile";
import Filters from "@/components/filters";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

function OwnerDashboardPage() {
  const [salons = [], setSalons] = React.useState<ISalon[]>([]);
  const [date = "", setDate] = React.useState<string>("");
  const [selectedSalon = "", setSelectedSalon] = React.useState<string>("");
  const [selectedStatus = "", setSelectedStatus] = React.useState<string>("");
  const [loading = true, setLoading] = React.useState<boolean>(true);
  const [filtersCleared = false, setFiltersCleared] =
    React.useState<boolean>(false);
  const [data, setData] = React.useState({
    totalBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
  });
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchDashboardData = async () => {
    try {
      const response: any = await getDashboardData(user.id, user.role, {
        salonIds: selectedSalon ? [selectedSalon] : salons.map((s) => s.id),
        date,
        status: selectedStatus,
      });
      if (!response.success) {
        toast.error(response.message);
      }
      setData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("An error occurred while fetching dashboard data");
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

  React.useEffect(() => {
    if (salons.length > 0) {
      fetchDashboardData();
    }
  }, [salons]);

  useEffect(() => {
    if (filtersCleared) {
      fetchDashboardData();
    }
  }, [filtersCleared]);

  useEffect(() => {
    if (user) {
      fetchSalons();
    }
  }, [user]);

  return (
    <div>
      <PageTitle title="Dashboard" />

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
          fetchData: fetchDashboardData,
        }}
      />

      {loading && <Spinner />}

      {!loading && (
        <div className="grid grid-cols-4 gap-5 mt-7">
          <DashboardTile
            title="Total Bookings"
            value={data.totalBookings}
            description="Total number of bookings"
          />
          <DashboardTile
            title="Cancelled Bookings"
            value={data.cancelledBookings}
            description="Total number of cancelled bookings"
          />
          <DashboardTile
            title="Completed Bookings"
            value={data.completedBookings}
            description="Total number of completed bookings"
          />
          <DashboardTile
            title="Upcoming Bookings"
            value={data.upcomingBookings}
            description="Total number of upcoming bookings"
          />
        </div>
      )}
    </div>
  );
}

export default OwnerDashboardPage;
