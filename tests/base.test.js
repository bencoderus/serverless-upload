const mockCallback = jest.fn((x) => x + 0).mockReturnValue(3);

test('adds 1 + 2 to equal 3', () => {
  expect(mockCallback(4)).toBe(3);

  expect(mockCallback.mock.calls.length).toBe(1);
});

test('Substituting the filter function with a mock', () => {
  const filterTestFn = jest.fn();

  filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

  const result = [11, 12].filter((num) => filterTestFn(num));

  expect(result.length).toBe(1);
});

