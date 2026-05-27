import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Spice & Masalas",
        "Beverage & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant and packaged Food",
        "Baby and Pet Care",
      ],
      required: true,
    },
    // Price should be a string (or number) representing the amount, not the unit enum
    price: {
      type: String,
      required: true,
    },
    // Unit should be one of the allowed unit enum values
    unit: {
      type: String,
      enum: ["kg", "g", "liter", "ml", "piece", "pack"],
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Grocery =
  mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema);
export default Grocery;
