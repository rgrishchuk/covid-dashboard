/* eslint-disable */
const {components} = require('./components');

const testState = {
  periodTotal: true,
  populationTotal: false
};

describe('getKey', () => {
  it('should return key = type String', () => {
    expect(components.getKey.call(testState, 'deaths')).toEqual(expect.any(String));
  });

  it('should return key = TotalConfirmed100k', () => {
    expect(components.getKey.call(testState, 'confirmed')).toMatch(/TotalConfirmed100k/);
  });

  it('should return key = ""', () => {
    expect(components.getKey.call(testState)).toEqual('');
  });
});
