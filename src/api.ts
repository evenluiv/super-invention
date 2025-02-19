import express, { Request, Response } from "express";
import dotenv from "dotenv";

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

if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  
export default app;