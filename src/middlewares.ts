import { NextFunction, Request, Response } from "express";
import { Metric } from "./interfaces/Metric";

export const metrics: Record<string, Metric> = {};

export async function requestMetrics(req: Request, res: Response, next: NextFunction) {
    
    const start = Date.now();
    next();
    const latency = Date.now() - start;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const routePath = req.route?.path || req.path;
        const method = req.method;
        const key = `${method} ${routePath}`;

        console.log(`${key} ${res.statusCode} ${duration}ms (Latency: ${latency}ms) responseType{${res.get('Content-Type')}}`);

        if (!metrics[key]) {
            metrics[key] = { count: 0, totalDuration: 0, totalLatency: 0 };
        }

        metrics[key].count += 1;
        metrics[key].totalDuration += duration;
        metrics[key].totalLatency += latency;
    });
}

export async function getMetrics(_req: Request, res: Response) {
    console.log("GET /metrics request received");

    try {
        const metricsData = Object.entries(metrics).map(([endpoint, data]) => ({
            endpoint,
            mean_request_duration: data.totalDuration / data.count,
            mean_latency: data.totalLatency / data.count,
            request_count: data.count,
        }));

        console.log("GET /metrics success - Returning metrics data", metricsData);
        res.status(200).json(metricsData);
    } catch (error: any) {
        console.error("Internal server error in GET /metrics", { error: error.message });
        res.status(500).json({ error: error.message });
    }
}