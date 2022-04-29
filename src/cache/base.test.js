const CacheBase = require('./base');

const rawData = {
  1: {
    id: 1,
    name: '桃園國際棒球場',
  },
  2: {
    id: 2,
    name: '台南棒球場',
  },
};

const getFieldsData = jest.fn((fieldId) => {
  return Promise.resolve(rawData[fieldId]);
});

describe('get', () => {
  class FieldsCache extends CacheBase {
    async fetch(fieldId) {
      return await getFieldsData(fieldId);
    }

    getKeyName() {
      return 'fields';
    }

    getVersion() {
      return 1;
    }

    getExpiredTime() {
      return 60 * 60 * 24 * 30;
    }
  }

  afterEach(async () => {
    await new FieldsCache().purge();
  });

  it('should set and get properly', async () => {
    const fieldsCache = new FieldsCache();

    const data1 = await fieldsCache.get(1);
    expect(data1.name).toEqual('桃園國際棒球場');

    const data2 = await fieldsCache.get(2);
    expect(data2.name).toEqual('台南棒球場');
    expect(getFieldsData.mock.calls).toHaveLength(2);
  });

  it('should call the heavy fetch once only', async () => {
    const fieldsCache = new FieldsCache();

    let data = await fieldsCache.get(1);
    expect(data.name).toEqual('桃園國際棒球場');

    data = await fieldsCache.get(1);
    expect(data.name).toEqual('桃園國際棒球場');

    expect(getFieldsData.mock.calls).toHaveLength(1);
  });
});
