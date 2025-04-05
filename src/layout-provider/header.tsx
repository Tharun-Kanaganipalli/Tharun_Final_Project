import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import React from "react";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";

function Header() {
  const { user } = usersGlobalStore() as IUsersStore;

  const [showMenu, setShowMenu] = React.useState(false);
  const router = useRouter();
  return (
    <div className="bg-primary p-5 flex justify-between items-center">
      <div onClick={() => router.push("/account")} className="cursor-pointer">
        <b className="text-2xl font-bold text-green-500">
           <b>Q . S . F</b>
        </b>
      </div>
      <div className="flex items-center gap-5">
        <p className="text-white text-sm">{user?.name}</p>

        <Button size={"icon"} onClick={() => setShowMenu(true)}>
          <Menu size={20} color="white" />
        </Button>
      </div>

      {showMenu && <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />}
    </div>
  );
}

export default Header;
