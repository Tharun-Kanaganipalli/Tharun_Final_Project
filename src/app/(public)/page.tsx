import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Homepage() {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center bg-gray-200 p-5 px-20">
        <h1 className="text-xl font-bold">Quick Pick</h1>

        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 min-h-[80vh] items-center px-20">
        <div className="col-span-1 flex flex-col gap-5">
          <h1 className="text-2xl font-bold">
            Welcome to Quick Pick Salon Finder
          </h1>
          <p className="text-sm text-gray-500 font-semibold">
            Quick Pick is a platform that connects barbers with customers. It
            helps customers find barbers near them and book appointments with
            them.
          </p>
          <Button className="w-max">
            <Link href="/barbers">Find a Salon</Link>
          </Button>
        </div>
        <div className="col-span-1 flex justify-end">
          <img src="./hero.jpg" alt="" className="h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
