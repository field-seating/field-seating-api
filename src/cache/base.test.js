const CacheBase = require('./base');

const getFieldsData = jest.fn(() =>
  Promise.resolve({
    1: {
      id: 1,
      name: '桃園國際棒球場',
    },
    2: {
      id: 2,
      name: '台南棒球場',
    },
  })
);

describe('cache base', () => {
  class FieldsCache extends CacheBase {
    async fetch() {
      return await getFieldsData();
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
    await new FieldsCache({ logger: console }).purge();
  });

  it('should set and get properly', async () => {
    const fieldsCache = new FieldsCache({ logger: console });

    const data = await fieldsCache.get();
    expect(data[1].name).toEqual('桃園國際棒球場');
  });

  it('should call the heavy fetch once only', async () => {
    const fieldsCache = new FieldsCache({ logger: console });

    let data = await fieldsCache.get();
    expect(data[1].name).toEqual('桃園國際棒球場');

    data = await fieldsCache.get();
    expect(data[1].name).toEqual('桃園國際棒球場');

    expect(getFieldsData.mock.calls).toHaveLength(1);
  });
});
