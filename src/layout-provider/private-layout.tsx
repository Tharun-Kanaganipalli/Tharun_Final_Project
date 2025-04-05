import React, { useEffect } from "react";
import Header from "./header";
import { IUsersStore, usersGlobalStore } from "@/store/users-store";
import { getCurrentUser } from "@/actions/users";
import Spinner from "@/components/spinner";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = usersGlobalStore() as IUsersStore;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await getCurrentUser(token!);
      if (response.success) {
        setUser(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Cookies.remove("token");
      router.push("/login");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner parentHeight={50} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
