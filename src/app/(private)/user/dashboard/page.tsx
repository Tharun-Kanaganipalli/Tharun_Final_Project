"use client";
import { getDashboardData } from "@/actions/dashboard";
import DashboardTile from "@/components/dashboard-tile";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import React from "react";
import toast from "react-hot-toast";

function UsrDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    totalBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
  });
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchDashboardData = async () => {
    try {
      const response: any = await getDashboardData(user.id , user.role);
      if (!response.success) {
        toast.error(response.message);
      }
      setData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("An error occurred while fetching dashboard data");
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <PageTitle title="Dashboard" />

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

export default UsrDashboardPage;
