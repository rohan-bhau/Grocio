/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroSection from '../HeroSection'
import CategorySlider from '../CategorySlider'
import connectDb from '@/lib/db'
import Grocery from '@/models/grocery.model'
import GroceryItemCard from '../GroceryItemCard'

const UserDashboard = async () => {
  await connectDb()
  const groceries = await Grocery.find({})
  const plainGroceries = JSON.parse(JSON.stringify(groceries))
  return (
    <div>
      <HeroSection />
      <CategorySlider />

      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight mb-6">
         Popular Grocery Items
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {plainGroceries.map((item: any) => (
            <GroceryItemCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard
