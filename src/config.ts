import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN || '[your-pipedrive-api-token]';
export const PIPEDRIVE_API_BASE = process.env.PIPEDRIVE_API_BASE || 'https://api.pipedrive.com/v1';