/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroSection from "../HeroSection";
import CategorySlider from "../CategorySlider";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import UserDashboardClient from "../UserDashboardClient";
import { auth } from "@/auth";

const UserDashboard = async () => {
  await connectDb();
  const session = await auth()
  console.log(session)
  const groceries = await Grocery.find({});
  const plainGroceries = JSON.parse(JSON.stringify(groceries));
  return (
    <div>
      <HeroSection />
      <CategorySlider />
      <UserDashboardClient groceries={plainGroceries} />
    </div>
  );
};

export default UserDashboard;
