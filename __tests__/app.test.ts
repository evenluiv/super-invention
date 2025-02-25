import { Request, Response } from 'express';
import { getDeals, postDeals, updateDeal } from "../src/api/deals";
import { getMetrics, metrics } from "../src/middlewares";

global.fetch = jest.fn();

const createMockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("getDeals", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 200 and deals data when fetch is successful", async () => {
    const mockData = { success: true, deals: [{ id: 1, title: "Deal 1" }] };
    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const req = {} as Request;
    const res = createMockResponse();

    await getDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("should return error response when fetch response is not ok", async () => {
    const errorData = { message: "Bad Request" };
    (global as any).fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue(errorData),
    });

    const req = {} as Request;
    const res = createMockResponse();

    await getDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorData });
  });

  it("should return 500 when fetch throws an error", async () => {
    const errorMessage = "Network error";
    (global as any).fetch.mockRejectedValue(new Error(errorMessage));

    const req = {} as Request;
    const res = createMockResponse();

    await getDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("postDeals", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 400 if "title" is missing in the deal', async () => {
    const req = { body: {} } as Request;
    const res = createMockResponse();

    await postDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'The "title" field is required.',
    });
  });

  it("should return 201 and deal data when fetch is successful", async () => {
    const deal = { title: "New Deal", amount: 1000 };
    const mockData = { success: true, data: deal };

    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const req = { body: deal } as Request;
    const res = createMockResponse();

    await postDeals(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals?api_token="),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deal),
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("should return error response when fetch response is not ok", async () => {
    const deal = { title: "New Deal" };
    const errorData = { message: "Invalid data" };

    (global as any).fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue(errorData),
    });

    const req = { body: deal } as Request;
    const res = createMockResponse();

    await postDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorData });
  });

  it("should return 500 when fetch throws an error", async () => {
    const deal = { title: "New Deal" };
    const errorMessage = "Network error";

    (global as any).fetch.mockRejectedValue(new Error(errorMessage));

    const req = { body: deal } as Request;
    const res = createMockResponse();

    await postDeals(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("updateDeal", () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if deal ID is missing", async () => {
    const req = {
      params: {},
      body: { status: "won" },
    } as unknown as Request;
    const res = createMockResponse();

    await updateDeal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Deal ID is required." });
  });

  it("should return 200 and updated deal data when fetch is successful", async () => {
    const updateData = { status: "lost" };
    const mockData = { success: true, data: updateData };

    (global as any).fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const req = {
      params: { id: "123" },
      body: updateData,
    } as unknown as Request;
    const res = createMockResponse();

    await updateDeal(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/deals/123?api_token="),
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("should return error response when fetch response is not ok", async () => {
    const updateData = { status: "lost" };
    const errorData = { message: "Update failed" };

    (global as any).fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue(errorData),
    });

    const req = {
      params: { id: "123" },
      body: updateData,
    } as unknown as Request;
    const res = createMockResponse();

    await updateDeal(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorData });
  });

  it("should return 500 when fetch throws an error", async () => {
    const updateData = { status: "lost" };
    const errorMessage = "Network error";

    (global as any).fetch.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { id: "123" },
      body: updateData,
    } as unknown as Request;
    const res = createMockResponse();

    await updateDeal(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});

describe("getMetrics", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Clear the global metrics object before each test
    for (const key in metrics) {
      delete metrics[key];
    }
    
    // Create a minimal mock for the Express request
    req = {};

    // Create a mock for the Express response
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock } as unknown as Response;
  });

  it("should return an empty array when no metrics exist", async () => {
    await getMetrics(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([]);
  });

  it("should return correct metrics data for a single endpoint", async () => {
    const key = "GET /test";
    metrics[key] = {
      count: 2,
      totalDuration: 100, // total request duration in ms
      totalLatency: 40,   // total latency in ms
    };

    await getMetrics(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([
      {
        endpoint: key,
        mean_request_duration: 50, // 100 / 2
        mean_latency: 20,          // 40 / 2
        request_count: 2,
      },
    ]);
  });

  it("should return correct metrics data for multiple endpoints", async () => {
    metrics["GET /test"] = {
      count: 2,
      totalDuration: 100,
      totalLatency: 40,
    };
    metrics["POST /submit"] = {
      count: 3,
      totalDuration: 150,
      totalLatency: 60,
    };

    await getMetrics(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          endpoint: "GET /test",
          mean_request_duration: 50, // 100 / 2
          mean_latency: 20,          // 40 / 2
          request_count: 2,
        },
        {
          endpoint: "POST /submit",
          mean_request_duration: 50, // 150 / 3
          mean_latency: 20,          // 60 / 3
          request_count: 3,
        },
      ])
    );
  });
});
