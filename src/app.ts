import "reflect-metadata";
import express from "express";
import userRouter from "./routes/user.router";

export const app = express();

app.use(express.json());
app.use("/user", userRouter);