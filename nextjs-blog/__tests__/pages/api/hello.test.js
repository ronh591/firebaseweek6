import handler from '../../../pages/api/hello';

describe('API /api/hello', () => {
  it('returns 200 with { text: "Hello" }', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: 'Hello' });
  });

  it('calls status before json', () => {
    const callOrder = [];
    const req = {};
    const res = {
      status: jest.fn(() => {
        callOrder.push('status');
        return res;
      }),
      json: jest.fn(() => {
        callOrder.push('json');
      }),
    };

    handler(req, res);
    expect(callOrder).toEqual(['status', 'json']);
  });
});
