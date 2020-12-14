const _base = "https://api.covid19api.com/";

export default class Service {
  _getResource = async (url) => {
    const response = await fetch(new URL(url, _base));
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    return await response.json();
  };

  getNameCountries = async () => {
    return await this._getResource("countries");
  };

  getFlagsAndPopulation = async () => {
    const url =
      "https://restcountries.eu/rest/v2/all?fields=name;population;flag";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    return await response.json();
  };
}
