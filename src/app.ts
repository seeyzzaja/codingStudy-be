import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { successResponse } from "#utils/response";
import userRouter from "#user/route/user.route";
import authRouter from "#auth/route/auth.route";
import courseRouter from "#course/route/course.route";
import { errorHandler } from "#middlewares/error.handler";


const app = express();

// app.get("/", (_req, _res) => {
//   //   res.redirect("/api-docs");
// });

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request masuk jam ${new Date().toISOString()}`);
  req.startTime = Date.now();
  next();
});


app.get("/", (req: Request, res: Response) => {
  const processTime = Date.now() - (req.startTime ?? Date.now());
  successResponse(
    res,
    "Selamat datang",
    {
     
      status: "Server hidup!",
      waktu_proses: `${processTime} ms`,
    },
    null,
    200
  );
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use(express.static("./"));

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new Error(`Route ${req.originalUrl} tidak ditemukan`));
});
app.use(errorHandler);

export default app;
