"use client";
import { getReviewsByOwnerId } from "@/actions/reviews";
import { getSalonsByOwnerId } from "@/actions/salons";
import Info from "@/components/info";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { IReview, ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ratings } from "@/constants";

function SalonOwnerReviews() {
  const [salons = [], setSalons] = React.useState<ISalon[]>([]);
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedSalon, setSelectedSalon] = React.useState<string>("");
  const [selectedRating, setSelectedRating] = React.useState<number>(0);
  const [date = "", setDate] = React.useState<string>("");
  const [filtersCleared = false, setFiltersCleared] =
    React.useState<boolean>(false);
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getReviewsByOwnerId({
        salonIds: selectedSalon
          ? [selectedSalon]
          : salons.map((salon) => salon.id),
        rating: selectedRating,
        date,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      setReviews(response.data);
    } catch (error: any) {
      toast.error(error.message);
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

  const renderProperty = (label: string, value: any) => {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-bold text-sm">{value}</span>
      </div>
    );
  };

  React.useEffect(() => {
    if (salons.length > 0) {
      fetchData();
    }
  }, [salons]);

  React.useEffect(() => {
    if (user) {
      fetchSalons();
    }
  }, [user]);

  useEffect(() => { 
    if (filtersCleared) {
      fetchData();
      setFiltersCleared(false);
    }
  } , [filtersCleared]);

  return (
    <div>
      <PageTitle title="My Reviews" />

      <div className="grid grid-cols-4 gap-5 items-end my-5">
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

        <div className="flex gap-1 flex-col">
          <h1 className="text-sm">Select Date</h1>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-[10px] border border-gray-500 rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-1 flex-col">
          <h1 className="text-sm">Select Rating</h1>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(Number(e.target.value || 0))}
            className="w-full p-[10px] border border-gray-500 rounded-lg text-sm"
          >
            <option value={0}>All</option>
            {ratings.map((rating: any) => (
              <option
                key={rating.value}
                value={rating.value}
                className="text-sm"
              >
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={() => {
              setFiltersCleared(!filtersCleared);
              setSelectedSalon("");
              setDate("");
              setSelectedRating(0);
            }}
            variant={"outline"}
          >
            Clear Filters
          </Button>
          <Button onClick={fetchData}>Apply Filter</Button>
        </div>
      </div>

      {!loading && reviews.length === 0 && <Info message="No reviews found" />}

      {loading && <Spinner />}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-7 mt-7">
          {reviews.map((review) => (
            <div
              className="border border-gray-400 p-5 rounded grid grid-cols-3 gap-5"
              key={review.id}
            >
              {renderProperty("Salon", review.salon.name)}
              {renderProperty("User", review.user.name)}
              {renderProperty("Rating", review.rating)}
              {renderProperty("Comment", review.comment)}
              {renderProperty(
                "Date",
                dayjs(review.created_at).format("MMMM DD, YYYY hh:mm A")
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalonOwnerReviews;
