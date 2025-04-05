import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  FolderKanban,
  HeartHandshake,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  User2,
  UserSquare,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import Cookies from "js-cookie";

interface SidebarProps {
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
}

function Sidebar({ showMenu, setShowMenu }: SidebarProps) {
  const { user } = usersGlobalStore() as IUsersStore;
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const iconSize = 12;

  const userMenuItems = [
    {
      title: "Dashboard",
      icon: <ShoppingBag size={14} />,
      path: "/user/dashboard",
    },
    {
      title: "Schedule Appointment",
      icon: <ShoppingBag size={14} />,
      path: "/user/schedule-appointment",
    },
    {
      title: "My Appointments",
      icon: <ShieldCheck size={14} />,
      path: "/user/appointments",
    },
    {
      title: "My Reviews",
      icon: <HeartHandshake size={14} />,
      path : "/user/reviews"
    },
    {
      title: "Profile",
      icon: <UserSquare size={14} />,
      path: "/user/profile",
    },
  ];

  const salonOwnerMenuItems = [
    {
      title: "Dashboard",
      icon: <UserSquare size={14} />,
      path: "/salon-owner/dashboard",
    },
    {
      title: "Register / Manage Salon",
      icon: <ShieldCheck size={14} />,
      path: "/salon-owner/salons",
    },
    {
      title: "Appointments",
      icon: <User2 size={14} />,
      path: "/salon-owner/appointments",
    },
    // {
    //   title: "Customers",
    //   icon: <FolderKanban size={14} />,
    //   path: "/salon-owner/customers",
    // },
    {
      title: "Reviews",
      icon: <HeartHandshake size={14} />,
      path : "/salon-owner/reviews"
    },
    {
      title: "Profile",
      icon: <UserSquare size={14} />,
      path: "/salon-owner/profile",
    },
  ];

  const onLogout = async () => {
    try {
      setLoading(true);
      await Cookies.remove("token");
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  let menuItemsToShow =
    user.role === "salon-owner" ? salonOwnerMenuItems : userMenuItems;

  return (
    <Sheet open={showMenu} onOpenChange={setShowMenu}>
      <SheetContent className="bg-white lg:min-w-[400px] p-5">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-7 mt-10">
          {menuItemsToShow.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 cursor-pointer p-3 ${
                pathname === item.path
                  ? "bg-gray-50 border border-gray-500 rounded text-primary"
                  : ""
              }`}
              onClick={() => {
                router.push(item.path!);
                setShowMenu(false);
              }}
            >
              {item.icon}
              <p className="text-sm">{item.title}</p>
            </div>
          ))}
        </div>

        <Button className="w-full mt-7" disabled={loading} onClick={onLogout}>
          <LogOut size={iconSize} />
          Logout
        </Button>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
