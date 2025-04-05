"use client";
import { getAllSalons } from "@/actions/salons";
import Info from "@/components/info";
import PageTitle from "@/components/page-title";
import Spinner from "@/components/spinner";
import { getDistance } from "@/helpers/distance";
import { ISalon } from "@/interfaces";
import React, { useEffect } from "react";
import PlacesAutocomplete from "../../salon-owner/salons/_common/salon-form/address-selection-2";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const filterOptions = [
  {
    label: "Nearby",
    value: "nearby",
  },
  {
    label: "Cheapest",
    value: "cheapest",
  },
  {
    label: "Top Rated",
    value: "top-rated",
  },
  {
    label: "Best offers",
    value: "best-offers",
  },
];

function ScheduleAppointment() {
  const [salons, setSalons] = React.useState([]);
  const [filteredSalons, setFilteredSalons] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllSalons();
      if (response.success) {
        setSalons(response.data);
        setFilteredSalons(response.data);
      }
    } catch (error) {
      setSalons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const sortSalons = (filter: string) => {
    try {
      let sorted = [...salons];
      // for now only nearby and cheapest are implemented
      if (filter === "nearby") {
        sorted = [...salons].sort((a: ISalon, b: ISalon) => {
          const distanceA = getDistance({
            sourceLat: parseFloat(currentLocation.latitude),
            sourceLng: parseFloat(currentLocation.longitude),
            destinationLat: parseFloat(a.latitude),
            destinationLng: parseFloat(a.longitude),
          });
          const distanceB = getDistance({
            sourceLat: parseFloat(currentLocation.latitude),
            sourceLng: parseFloat(currentLocation.longitude),
            destinationLat: parseFloat(b.latitude),
            destinationLng: parseFloat(b.longitude),
          });

          return distanceA - distanceB;
        });
      }

      if (filter === "cheapest") {
        sorted = [...salons].sort((a: ISalon, b: ISalon) => {
          return a.minimum_service_price - b.minimum_service_price;
        });
      }

      if (filter === "top-rated") {
        sorted = [...salons].sort((a: ISalon, b: ISalon) => {
          return b.average_rating - a.average_rating;
        });
      }

      if (filter === "best-offers") {
        sorted = [...salons].sort((a: ISalon, b: ISalon) => {
          return b.offer_status === "active" ? 1 : -1;
        });
      }
      setFilteredSalons(sorted);
    } catch (error) {
      setFilteredSalons(salons);
    }
  };

  useEffect(() => {
    if ((selectedFilter==='nearby' && currentLocation) || selectedFilter !== "nearby") {
      sortSalons(selectedFilter);
    }
  }, [currentLocation, selectedFilter]);

  return (
    <div>
      <div className="flex gap-5 items-center justify-between">
        <PageTitle title="Schedule Appointment" />

        <div className="flex flex-col gap-1">
          <h1 className="text-sm text-gray-500">Filter by</h1>
          <select
            className="border border-gray-300 rounded p-2 w-80 text-sm"
            onChange={(e) => {
              if (e.target.value === "nearby" && !currentLocation) {
                return toast.error("Please select your location first");
              } else {
                setSelectedFilter(e.target.value);
              }
            }}
          >
            <option value="">Select</option>
            {filterOptions.map((option) => (
              <option
                className="text-sm"
                value={option.value}
                key={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && <Spinner parentHeight={120} />}
      {!loading && salons.length === 0 && <Info message="No salons found" />}

      {!loading && salons.length > 0 && (
        <div className="flex flex-col gap-5 mt-7">
          <PlacesAutocomplete
            value={currentLocation}
            onChange={(value) => setCurrentLocation(value)}
            initialValues={{}}
            hideMap
            placeholder="Select your location"
          />
          <div className="flex flex-col gap-5">
            {filteredSalons.map((salon: ISalon) => (
              <div
                className="border border-gray-300 p-5 rounded hover:border-black cursor-pointer flex flex-col"
                key={salon.id}
                onClick={() =>
                  router.push(`/user/schedule-appointment/${salon.id}`)
                }
              >
                <div>
                  <h1 className="text-sm font-bold">{salon.name}</h1>
                  <p className="text-xs text-gray-500">{salon.address}</p>
                </div>

                <h1 className="text-[13px] mt-3 font-semibold">
                  Minimum service price: $ {salon.minimum_service_price}
                </h1>

                {selectedFilter === "nearby" && (
                  <h1 className="text-[13px] mt-1 font-semibold">
                    Distance:{" "}
                    {getDistance({
                      sourceLat: parseFloat(currentLocation.latitude),
                      sourceLng: parseFloat(currentLocation.longitude),
                      destinationLat: parseFloat(salon.latitude),
                      destinationLng: parseFloat(salon.longitude),
                    }).toFixed(2)}{" "}
                    km
                  </h1>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleAppointment;
