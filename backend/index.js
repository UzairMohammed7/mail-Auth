import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import path from 'path';

import DbCon from './libs/db.js'
import AuthRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

// Connect to MongoDB
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json()) // allows us to parse incoming requests: req.body 
app.use(cookieParser()) // allows us to parse cookies from request body and pass them through to server

app.use("/api/auth", AuthRoutes)

if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "/frontend/dist")));

   app.get("*", (req, res) => {
   	  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
   });
}

app.listen(PORT, ()=>{
    DbCon()
    console.log(`Server listening on ${PORT}`)
})
