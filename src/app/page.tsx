import { auth } from "@/auth";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import DeliveryBoyDashboard from "@/components/dashboards/DeliveryBoyDashboard";
import UserDashboard from "@/components/dashboards/UserDashboard";
import EditRoleMobile from "@/components/EditRoleMobile";
import Navbar from "@/components/Navbar";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

const Home = async () => {
  await connectDb();
  const session = await auth();

  const user = await User.findById(session?.user?.id);
  const plainUser = JSON.parse(JSON.stringify(user));
  // console.log(user)
  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");

  if (inComplete) {
    return <EditRoleMobile />;
  }

  return (
    <div>
      <Navbar user={plainUser} />
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoyDashboard />
      )}
    </div>
  );
};

export default Home;
