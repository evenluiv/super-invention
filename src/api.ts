import express, { application, Request, Response } from "express";
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

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_BASE = process.env.PIPEDRIVE_API_BASE || 'https://api.pipedrive.com/v1';

app.get('/deals', async (req: Request, res: Response) => {

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

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  
export default app;