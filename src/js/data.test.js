/* eslint-disable */
const {getData, getJSON, getDataPer100k} = require('./data');

describe('getData', () => {
  it('should resolve correct data', () =>
    getData().then((data) => expect(data).toEqual(expect.any(Object))));
});

describe('getJSON', () => {
  it('should reject on empty input', () => {
    return getJSON('').catch((e) => expect(e).toEqual(null));
  });
});

describe('getDataPer100k', () => {
  it('should return number = 67808.33', () => {
    expect(getDataPer100k(234233, 345434)).toEqual(67808.33);
  });
});
