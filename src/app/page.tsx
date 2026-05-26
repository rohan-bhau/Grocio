import { auth } from "@/auth"
import EditRoleMobile from "@/components/EditRoleMobile"
import connectDb from "@/lib/db"
import User from "@/models/user.model"
import { redirect } from "next/navigation"


const Home = async () => {
  await connectDb()
  const session = await auth()
  
  const user = await User.findById(session?.user?.id)
  console.log(user)
  if (!user) {
    redirect("/login")
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role === "user")
  
  if (inComplete) {
    return <EditRoleMobile/>
  }

  return (
    <div>
      
    </div>
  )
}

export default Home
