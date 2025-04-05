"use client";
import { registerUser } from "@/actions/users";
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
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await registerUser(values);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success("Account created successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formSchema = z.object({
    role: z.string().optional(),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters long",
    }),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "user",
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="h-screen items-center justify-center flex auth-bg">
      <div className="w-[500px] flex flex-col gap-5 border p-5 rounded-md bg-white">
        <h1 className="text-xl mb-2 font-bold text-gray-500">
          Register your acount
        </h1>{" "}
        <hr />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {" "}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-10"
                    >
                      {["user", "salon-owner"].map((role) => (
                        <FormItem className="flex items-center" key={role}>
                          <FormControl>
                            <RadioGroupItem value={role} />
                          </FormControl>
                          <FormLabel className="capitalize text-sm">
                            {role.replace("-", " ")}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center text-sm">
              <Link href="/login" className="flex gap-5">
                Aleady have an account? <div className="underline">Login</div>
              </Link>
              <Button disabled={loading} type="submit">
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
