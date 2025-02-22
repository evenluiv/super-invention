import request from 'supertest';
import app from '../src/api';

global.fetch = jest.fn();

const API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_BASE = process.env.PIPEDRIVE_API_BASE || 'https://api.pipedrive.com/v1';

describe('Deals API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

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

    it('should forward non-200 status codes from API', async () => {
      const errorData = { error: 'Unauthorized' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(errorData),
      });
  
      const response = await request(app).get('/deals');
      
      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ error: errorData });
    });
  
    it('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
  
      const response = await request(app).get('/deals');
      
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toMatch('Network error');
    });
  });

  describe('POST /deals', () => {
    it('should create a new deal', async () => {
      const mockDeal = {
        title: 'Test Deal',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ data: mockDeal })
      });

      const response = await request(app)
        .post('/deals')
        .send({
          title: 'Test Deal',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ data: mockDeal });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/deals?api_token='),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Deal',
          })
        })
      );
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/deals')
        .send({
          value: 1000
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'The "title" field is required.'
      });
    });

    it('should handle Pipedrive API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' })
      });

      const response = await request(app)
        .post('/deals')
        .send({
          title: 'Bad Deal'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: { error: 'Bad request' } });
    });

    it('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const response = await request(app)
        .post('/deals')
        .send({
          title: 'Test Deal'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Network error' });
    });
  });

  describe('PUT /deals/:id', () => {
    it('should update an existing deal', async () => {
      const mockDeal = {
        title: 'Updated Deal',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: mockDeal })
      });

      const response = await request(app)
        .put('/deals/123')
        .send({
          title: 'Updated Deal',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockDeal });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${PIPEDRIVE_API_BASE}/deals/123?api_token=${API_TOKEN}`),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Updated Deal',
          })
        })
      );
    });

    it('should return 400 if deal ID is missing', async () => {
      const response = await request(app)
        .put('/deals/')
        .send({
          title: 'Updated Deal'
        });

      expect(response.status).toBe(404);
    });

    it('should handle Pipedrive API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Deal not found' })
      });

      const response = await request(app)
        .put('/deals/999')
        .send({
          title: 'Non-existent Deal'
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: { error: 'Deal not found' } });
    });

    it('should handle server errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .put('/deals/123')
        .send({
          title: 'Updated Deal'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database error' });
    });
  });

});
