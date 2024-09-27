import "reflect-metadata";

import express from "express";
import userRouter from "./routes/user.router";
import mealRouter from "./routes/meal.router";

export const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/meal", mealRouter);