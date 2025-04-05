"use client";
import { getReviewsByUserId } from "@/actions/reviews";
import Info from "@/components/info";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { ratings } from "@/constants";
import { IReview } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";

function UserReviews() {
  const [reviews, setReviews] = React.useState<IReview[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getReviewsByUserId(user.id);
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

  React.useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const renderProperty = (label: string, value: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );

  return (
    <div>
      <PageTitle title="My Reviews" />
      {loading && <Spinner />}

      {!loading && reviews.length === 0 && <Info message="No reviews found" />}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-7 mt-7">
          {reviews.map((review) => (
            <div
              className="border border-gray-400 p-5 rounded grid grid-cols-3 gap-5"
              key={review.id}
            >
              {renderProperty("Salon", review.salon.name)}
              {renderProperty(
                "Rating",

                ratings.find((r) => r.value === review.rating)?.label || ""
              )}
              {renderProperty(
                "Reviewed On",
                dayjs(review.created_at).format("MMM DD, YYYY hh:mm A")
              )}

              <div className="flex flex-col col-span-3">
                <span className="text-sm text-gray-500">Review</span>
                <span className="text-sm">{review.comment}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserReviews;
