import { Request, Response } from "express";
import { PIPEDRIVE_API_BASE, API_TOKEN } from "../config";
import { Deal, UpdateDeal } from "../interfaces/Deal";

export async function getDeals(_req: Request, res: Response) {
    console.log("GET /deals request received");

    try {
        const response = await fetch(`${PIPEDRIVE_API_BASE}/deals?api_token=${API_TOKEN}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching deals", { status: response.status, error: errorData });
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        console.log(`GET /deals success - Retrieved deals`);
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Internal server error in GET /deals", { error: error.message });
        res.status(500).json({ error: error.message });
    }
};

export async function postDeals(req: Request, res: Response) {
    const deal: Deal = req.body;
    console.log("POST /deals request received", deal);

    if (!deal.title) {
        console.warn("POST /deals failed - Missing required field: title");
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
            console.error("Error creating deal", { status: response.status, error: errorData });
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        console.log(`POST /deals success - Created deal successfully`);
        res.status(201).json(data);
    } catch (error: any) {
        console.error("Internal server error in POST /deals", { error: error.message });
        res.status(500).json({ error: error.message });
    }
};

export async function updateDeal(req: Request, res: Response) {
    const dealID = req.params.id;
    const updateData: UpdateDeal = req.body;
    console.log("PUT /deals request received", { dealID, updateData });

    if (!dealID) {
        console.warn("PUT /deals failed - Missing deal ID");
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
            console.error("Error updating deal", { status: response.status, error: errorData });
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        console.log(`PUT /deals success - Updated deal with ID ${dealID}`);
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Internal server error in PUT /deals", { error: error.message });
        res.status(500).json({ error: error.message });
    }
};