import express from "express";
import { requestMetrics } from "./middlewares";
import dealsRouter from "./routes/deals";
import metricsRouter from "./routes/metrics"

const app = express();

app.use(express.json());
app.use(requestMetrics);

app.use(dealsRouter);
app.use(metricsRouter);

export default app;