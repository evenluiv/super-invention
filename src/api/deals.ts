import { Request, Response } from "express";
import { makeApiRequest } from "../helpers";
import { Deal, UpdateDeal } from "../interfaces/Deal";

export async function getDeals(_req: Request, res: Response) {
    console.log("GET /deals request received");

    try {

        const data = await makeApiRequest("/deals");
        console.log("GET /deals success - Retrieved deals");
        res.status(200).json(data);
    } catch (error: any) {
        
        if (error.status) {
            console.log("Error fetching deals", error);
            res.status(error.status).json({ error: error.error });
        }
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

        const data = await makeApiRequest("/deals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deal),
        });
        
        console.log("POST /deals success - Created deal successfully");
        res.status(201).json(data);
    } catch (error: any) {

        if (error.status) {
            console.log("Error creating deal", error);
            res.status(error.status).json({ error: error.error });
        }
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
        res.status(400).json({ error: 'Deal ID is required.' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        console.warn("PUT /deals failed - Empty update data");
        res.status(400).json({ error: 'Update data cannot be empty.' });
    }

    try {

        const data = await makeApiRequest(`/deals/${dealID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        console.log(`PUT /deals success - Updated deal with ID ${dealID}`);
        res.status(200).json(data);
    } catch (error: any) {

        if (error.status) {
            console.log("Error uptating deal", error);
            res.status(error.status).json({ error: error.error });
        }
        console.error("Internal server error in PUT /deals", { error: error.message });
        res.status(500).json({ error: error.message });
    }
};