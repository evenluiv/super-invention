import { PIPEDRIVE_API_BASE, API_TOKEN } from "./config"

export async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
    
    const url = `${PIPEDRIVE_API_BASE}${endpoint}?api_token=${API_TOKEN}`;
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw { status: response.status, error: data };
    }

    return data;
}