import express, { application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

interface Deal {
    title: string;
    value?: number;
    label?: string[];
    currency?: string;
    user_id?: number;
    person_id?: number;
    org_id?: number;
    pipeline_id?: number;
    stage_id?: number;
    status?: "open" | "won" | "lost" | "deleted";
    origin_id?: string;
    channel?: number;
    channel_id?: string;
    add_time?: string;
    won_time?: string;
    lost_time?: string;
    close_time?: string;
    expected_close_date?: string;
    probability?: number;
    lost_reason?: string;
    visible_to?: "1" | "3" | "5" | "7";
}

type UpdateDeal = Partial<Deal>;

dotenv.config();

const app = express();
app.use(express.json());

interface Metric {
    count: number;
    totalDuration: number;
    totalLatency: number;
}

const metrics: Record<string, Metric> = {};

app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    next();
    const latency = Date.now() - start;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const routePath = req.route?.path || req.path;
        const method = req.method;
        const key = `${method} ${routePath}`;

        console.log(`${key} ${res.statusCode} ${duration}ms (Latency: ${latency}ms)`);

        if (!metrics[key]) {
            metrics[key] = { count: 0, totalDuration: 0, totalLatency: 0 };
        }

        metrics[key].count += 1;
        metrics[key].totalDuration += duration;
        metrics[key].totalLatency += latency;
    });
})

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_BASE = process.env.PIPEDRIVE_API_BASE || 'https://api.pipedrive.com/v1';

app.get('/deals', async (_req: Request, res: Response) => {

    try {
        const response = await fetch(`${PIPEDRIVE_API_BASE}/deals?api_token=${API_TOKEN}`);
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/deals', async (req: Request, res: Response) => {
    const deal: Deal = req.body;

    if (!deal.title) {
        return res.status(400).json({ error: 'The "title" field is required.' });
    }
    
    try {
        const response = await fetch(`${PIPEDRIVE_API_BASE}/deals?api_token=${API_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deal),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/deals/:id', async (req: Request, res: Response) => {
    const dealID = req.params.id;
    const updateData: UpdateDeal = req.body;

    if (!dealID) {
        return res.status(400).json({ error: 'Deal ID is required.' });
    }

    try {
        const response = await fetch(`${PIPEDRIVE_API_BASE}/deals/${dealID}?api_token=${API_TOKEN}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/metrics', (req: Request, res: Response) => {
    const metricsData = Object.entries(metrics).map(([endpoint, data]) => ({
        endpoint,
        mean_request_duration: data.totalDuration / data.count,
        mean_latency: data.totalLatency / data.count,
        request_count: data.count,
    }));
    res.status(200).json(metricsData);
});
  
export default app;