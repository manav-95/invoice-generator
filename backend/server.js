import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import invoiceRoutes from './routes/invoiceRoutes.js'

dotenv.config();

const app = express();

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://demo-invoice-gen.netlify.app"
    ]
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/invoices", invoiceRoutes)

app.listen(PORT, () => {
    console.log(`Server is Running On PORT: ${PORT}`);
});
