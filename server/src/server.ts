import express from "express";
import morgan from "morgan";
import googleLoginController from "./controllers/auth";
import userRouter from "./routes/user";
import postRouter from './routes/post'
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router  API
app.use("/api/auth", googleLoginController);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter)

export default app;
