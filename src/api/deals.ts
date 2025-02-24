import { Request, Response } from "express";
import { PIPEDRIVE_API_BASE, API_TOKEN } from "../config";
import { Deal, UpdateDeal } from "../interfaces/Deal";

export async function getDeals(_req: Request, res: Response) {

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
};

export async function postDeals(req: Request, res: Response) {
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
};

export async function updateDeal(req: Request, res: Response) {
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
};