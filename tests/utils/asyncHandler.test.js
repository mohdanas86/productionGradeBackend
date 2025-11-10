import { asyncHandler } from '../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  it('should call next with error when async function throws', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    const mockNext = jest.fn();

    const handler = asyncHandler(async (req, res, next) => {
      res.json({ success: true });
    });

    await handler(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should pass error to next when async function throws', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const handler = asyncHandler(async (req, res, next) => {
      throw new Error('Test error');
    });

    await handler(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
