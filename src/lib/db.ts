import mongoose from "mongoose";


const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
    throw new Error("Invalid Mongodb url")
}

let cache = global.mongoose

if (!cache) {
 cache= global.mongoose={connection:null, promise:null}   
}

const connectDb = async () => {
    if (cache.connection) {
        return cache.connection
    }

    if (!cache.promise) {
        cache.promise=mongoose.connect(mongoUrl).then((connection)=>connection.connection)
    }

    try {
        const connection = await cache.promise
        return connection
    } catch (error) {
        console.log(error)
    }
}

export default connectDb