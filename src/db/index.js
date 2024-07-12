import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const Instance = await mongoose.connect(`${process.env.VITE_MONGODB_URI}`);
        console.log(`\n MongoDB connected !! DB HOST : ${Instance.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;
