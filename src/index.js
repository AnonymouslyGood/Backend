import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
});

connectDB()

console.log('Services at: ', process.env.PORT)