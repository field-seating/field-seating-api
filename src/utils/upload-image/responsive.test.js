const { renderResizeInfo, renderDataset } = require('./responsive');

const sizeMap = {
  flag1: {
    value: 1,
  },
  flag2: {
    value: 2,
  },
};

describe('renderResizeInfo', () => {
  const resizeInfo = renderResizeInfo(sizeMap)({ filename: 'foo.jpeg' });

  it('should have proper list size', () => {
    expect(resizeInfo).toHaveLength(2);
  });

  it('should contain the original option', () => {
    expect(resizeInfo).toContainEqual({
      config: { value: 2 },
      filename: 'flag2/foo.jpeg',
    });
  });
});

describe('renderDataset', () => {
  const dataset = renderDataset(sizeMap)({
    filename: 'foo.jpeg',
    bucketName: 'staging/photos',
    assetDomain: 'https://example.cdn.com',
  });

  it('should contain the data', () => {
    expect(dataset).toEqual({
      flag1: 'https://example.cdn.com/staging/photos/flag1/foo.jpeg',
      flag2: 'https://example.cdn.com/staging/photos/flag2/foo.jpeg',
    });
  });
});
