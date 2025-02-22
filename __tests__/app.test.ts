import request from 'supertest';
import app from '../src/api';

global.fetch = jest.fn();

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_BASE = process.env.PIPEDRIVE_API_BASE || 'https://api.pipedrive.com/v1';

describe('GET /deals', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should respond with 200 status code and data when fetch is successful', async () => {
    const mockData = { deals: [{ id: 1, title: 'Test Deal' }] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const response = await request(app).get('/deals');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      `${PIPEDRIVE_API_BASE}/deals?api_token=${API_TOKEN}`
    );
  });

});