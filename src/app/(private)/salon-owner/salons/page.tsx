"use client";
import { deleteSalonById, getSalonsByOwnerId } from "@/actions/salons";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { ISalon } from "@/interfaces";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import Spinner from "@/components/spinner";
import Info from "@/components/info";
import dayjs from "dayjs";

function SaloonsListPage() {
  const [loading, setLoading] = useState(false);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const { user } = usersGlobalStore() as IUsersStore;

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response: any = await getSalonsByOwnerId(user.id);
      if (response.success) {
        setSalons(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  const deleteSalonHandler = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteSalonById(id);
      if (response.success) {
        toast.success("Salon deleted successfully");
        fetchSalons();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete salon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const columns = [
    "Name",
    "City",
    "State",
    "Zip",
    "Minimum Service Price",
    "Maximum Service Price",
    "Offer Status",
    "Created At",
    "Actions",
  ];

  return (
    <div>
      <div className="flex justify-between gap-5 items-center">
        <PageTitle title="Salons" />
        <Button>
          <Link href="/salon-owner/salons/add">Register new salon</Link>
        </Button>
      </div>

      {loading && <Spinner parentHeight={150} />}

      {!loading && salons.length === 0 && (
        <Info message="No salons found. Please register a new salon." />
      )}

      {!loading && salons.length > 0 && (
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
            {salons.map((salon: ISalon) => (
              <TableRow key={salon.id}>
                <TableCell>{salon.name}</TableCell>
                <TableCell>{salon.city}</TableCell>
                <TableCell>{salon.state}</TableCell>
                <TableCell>{salon.zip}</TableCell>
                <TableCell>$ {salon.minimum_service_price}</TableCell>
                <TableCell>$ {salon.maximum_service_price}</TableCell>
                <TableCell>{salon.offer_status}</TableCell>
                <TableCell>
                  {dayjs(salon.created_at).format("MMM DD, YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/salon-owner/salons/edit/${salon.id}`}>
                      <Button variant={"outline"} size={"icon"}>
                        <Edit2 size={12} />
                      </Button>
                    </Link>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => deleteSalonHandler(salon.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default SaloonsListPage;
