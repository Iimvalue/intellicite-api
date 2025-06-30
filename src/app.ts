import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import userRoutes from "./routes/users.routes";
import savedPaperRoutes from "./routes/savedPaper.routes";
import paperRoutes from "./routes/papers.routes";
import userHistoryRoutes from "./routes/userHistory.routes";
import citeCheckRoutes from "./routes/citeCheck.routes";
dotenv.config();
const port = process.env.PORT || 3000;
const app: Application = express();

connectDB().then(() => console.info("Database connected successfully"));

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/saved-papers", savedPaperRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/user-history", userHistoryRoutes);
app.use("/api/cite-check", citeCheckRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to IntelliCite",
    status: "Server is running successfully",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
export default app;
