import * as mappers from './mappers';

describe('lib/api/mappers', () => {
  function rethrow (mapper, value) {
    const result = mapper(value);
    if (result instanceof Error) throw result;
    return result;
  }

  describe('changedRecord', () => {
    function changedRecord (value) {
      return rethrow(mappers.changedRecord, value);
    }

    test('correct root error message', () => {
      const msg = 'api mapping error: invalid object at root';
      expect(() => changedRecord(null)).toThrow(msg);
      expect(() => changedRecord(undefined)).toThrow(msg);
    });

    test('success is mapped', () => {
      expect(changedRecord({})).toEqual({ success: false });
      expect(changedRecord({ success: null })).toEqual({ success: false });
      expect(changedRecord({ success: 'key' })).toEqual({ success: true });
      expect(changedRecord({ success: true })).toEqual({ success: true });
    });

    test('mapping errors', () => {
      expect(() => changedRecord({ errors: 'nope' })).toThrow('api mapping error: invalid list at root.errors');
    });
  });
});
