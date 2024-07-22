import dotenv from "dotenv";
import { app } from "./app.js"; // Import app from app.js
import connectDB from "./db/index.js";

// Load environment variables from .env file
dotenv.config({
    path: './env'
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
