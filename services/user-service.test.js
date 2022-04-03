describe('dummy test', () => {
  it('should return desired data', () => {
    const add = (a) => (b) => a + b;
    expect(add(1)(2)).toBe(3);
  });
});
