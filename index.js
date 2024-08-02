import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import {getenv} from "./src/core/helper.js"
import { CustomError } from "./src/core/customerror.js";
import bookingRouter from "./src/apis/booking/routes.js"
global.CustomError = CustomError
global.getenv = getenv

const app = express();

//For getting data from the frontend as json format
app.use(express.json());

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//trying to make api request from front end
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// Logging middleware to log to CLI
app.use(morgan("combined"));

app.use(`${getenv("BASE_URL")}booking`, bookingRouter)

app.get("/", (req, res) => {
  return res.status(200).json({
    code: 200,
    status: "success",
    message: 'JVEE BE Service up and running',
  }); 
})

// Catch-all route for non-existing endpoints
app.use((req, res) => {
  return res.status(404).json({
    code: 404,
    responseCode : "99",
    status: "failed",
    message: 'Endpoint not found',
    error: "An Error Occured!",
  });
});



const port = getenv("API_PORT") 
app.listen(port, () => console.log("SERVER LISTENING ON PORT: " + port));
