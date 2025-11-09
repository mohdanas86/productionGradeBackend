import { ApiError } from '../../src/utils/apiError.js';

describe('ApiError', () => {
  it('should create an ApiError instance with correct properties', () => {
    const error = new ApiError(
      400,
      'Bad Request',
      ['Invalid input'],
      'stack trace here'
    );

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.errors).toEqual(['Invalid input']);
    expect(error.success).toBe(false);
  });

  it('should set default values when optional parameters are not provided', () => {
    const error = new ApiError(500);

    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Something went wrong');
    expect(error.errors).toEqual([]);
    expect(error.success).toBe(false);
  });
});
