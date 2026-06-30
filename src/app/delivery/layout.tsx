import { auth } from "@/auth";
import DeliverySidebar from "@/components/DeliveryBoySlideBar";
import Navbar from "@/components/Navbar";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDb();
  const session = await auth();

  const user = await User.findById(session?.user?.id);
  const plainUser = JSON.parse(JSON.stringify(user));

  const role = user?.role
  if (role !== "deliveryBoy") {
    redirect("/unauthorized")
  }

  return (
    <div className="h-screen bg-[#F8F9FC] text-gray-800 flex overflow-hidden">
      <div className="hidden md:block w-64 flex-shrink-0 h-full border-r border-gray-200">
        <DeliverySidebar/>
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0 relative [transform:translateZ(0)]">
        <Navbar user={plainUser} />

        <div className="flex-1 overflow-y-auto pt-24">
          <main className="p-4 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
