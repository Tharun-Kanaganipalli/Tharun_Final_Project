"use client";
import { loginUser } from "@/actions/users";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addNewSalon, editSalonById } from "@/actions/salons";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import PlacesAutocomplete from "./address-selection-2";
import { Checkbox } from "@/components/ui/checkbox";
import { workingDays } from "@/constants";

interface SalonFormProps {
  initialValues?: any;
  formType: "add" | "edit";
}

const offerStatuses = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

function SalonForm({ initialValues, formType }: SalonFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = usersGlobalStore() as IUsersStore;
  const router = useRouter();
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      values.owner_id = user.id;
      let response = null;
      if (formType === "add") {
        response = await addNewSalon(values);
      } else {
        response = await editSalonById(initialValues.id, values);
      }

      if (response.success) {
        toast.success(
          `Salon ${formType === "add" ? "added" : "updated"} successfully`
        );
        router.push("/salon-owner/salons");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formSchema = z.object({
    name: z.string().min(3).max(255),
    address: z.string().min(3).max(255),
    city: z.string().min(3).max(255),
    state: z.string().min(3).max(255),
    zip: z.string().min(3).max(255),
    minimum_service_price: z.number().min(0),
    maximum_service_price: z.number().min(0),
    offer_status: z.string().min(3).max(255),

    working_days: z.array(z.string()),
    start_time: z.string(),
    end_time: z.string(),
    break_start_time: z.string(),
    break_end_time: z.string(),

    slot_duration: z.number(),
    max_bookings_per_slot: z.number(),

    latitude: z.string(),
    longitude: z.string(),
    location_display_name: z.string().min(3).max(255),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      address: initialValues?.address || "",
      city: initialValues?.city || "",
      state: initialValues?.state || "",
      zip: initialValues?.zip || "",
      minimum_service_price: initialValues?.minimum_service_price || 0,
      maximum_service_price: initialValues?.maximum_service_price || 0,
      offer_status: initialValues?.offer_status || "active",

      working_days: initialValues?.working_days || [],
      start_time: initialValues?.start_time || "",
      end_time: initialValues?.end_time || "",
      break_start_time: initialValues?.break_start_time || "",
      break_end_time: initialValues?.break_end_time || "",

      slot_duration: initialValues?.slot_duration || 0,
      max_bookings_per_slot: initialValues?.max_bookings_per_slot || 0,

      latitude: initialValues?.latitude || 17.385,
      longitude: initialValues?.longitude || 78.4867,
      location_display_name: initialValues?.location_display_name || "",
    },
  });

  const onWorkingDaysChange = (value: string) => {
    const workingDays = form.getValues().working_days;
    if (workingDays.includes(value)) {
      form.setValue(
        "working_days",
        workingDays.filter((day) => day !== value)
      );
    } else {
      form.setValue("working_days", [...workingDays, value]);
    }
  };

  return (
    <div className="mt-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Salon Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="minimum_service_price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Minimum Service Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maximum_service_price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Maximum Service Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offer_status"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Offer Status</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {offerStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5 border border-gray-300 p-5 rounded-md my-10">
            <div>
              <FormLabel>Working Days</FormLabel>
              <div className="flex gap-10 flex-wrap mt-2">
                {workingDays.map((day) => {
                  const isChecked = form.watch("working_days").includes(day.value);
                  
                  return (
                    <div className="flex items-center gap-2" key={day.value}>
                      <p className="text-sm">{day.label}</p>
                      <Checkbox
                        checked={isChecked}
                        aria-checked={isChecked}
                        onCheckedChange={() => onWorkingDaysChange(day.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="break_start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Break Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="break_end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Break End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slot_duration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Slot Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_bookings_per_slot"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Max Bookings Per Slot</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="text-sm flex flex-col gap-1">
            <p>Search for a place to get the address</p>

            <PlacesAutocomplete
              value={{
                latitude: form.getValues()?.latitude,
                longitude: form.getValues()?.longitude,
              }}
              onChange={(value: any) => {
                form.setValue("latitude", value?.latitude);
                form.setValue("longitude", value?.longitude);
                form.setValue(
                  "location_display_name",
                  value.location_display_name
                );
              }}
              initialValues={initialValues}
            />
          </div>

          <div className="flex justify-end gap-5 my-10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {formType === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SalonForm;
