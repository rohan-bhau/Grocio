import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Navbar from "@/components/Navbar";
import UserDashboard from "@/components/dashboards/UserDashboard";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

// Public homepage - anyone can view without login
// But if logged in, redirect admin and delivery boy to their dashboards
const Home = async () => {
  const session = await auth();
  console.log(session?.user);

  if (!session?.user?.id) {
    return (
      <div>
        <Navbar user={null} />
        <UserDashboard />
        <Footer />
      </div>
    );
  }

  // Logged in - get user details
  await connectDb();
  const user = await User.findById(session.user.id);

  if (!user) {
    return (
      <div>
        <Navbar user={null} />
        <UserDashboard />
        <Footer />
      </div>
    );
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  // Profile incomplete - ask for role and mobile
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  // Admin - redirect to admin panel
  if (user.role === "admin") {
    redirect("/admin");
  }

  // Delivery boy - redirect to delivery panel
  if (user.role === "deliveryBoy") {
    redirect("/delivery");
  }

  // Regular user - show homepage with logged-in navbar
  return (
    <div>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      <UserDashboard />
      <Footer />
    </div>
  );
};

export default Home;
