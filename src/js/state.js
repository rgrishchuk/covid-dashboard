export default class State {
  constructor() {
    this.data = null;
    this.currentRate = 'confirmed';
    this.currentCountry = 'global';
    this.periodTotal = true;
    this.populationTotal = true;
  }

  set(key, value) {
    this[key] = value;
    this.data.Countries = this.sortCovidData(this.data);
    document.dispatchEvent(new Event('updateState', { bubbles: true }));
  }

  sortCovidData(data) {
    return data.Countries.sort((a, b) => {
      const getKey = (typeSort = '') => {
        switch (this.currentRate) {
          case 'confirmed':
            return this.periodTotal ? `TotalConfirmed${typeSort}` : `NewConfirmed${typeSort}`;
          case 'deaths':
            return this.periodTotal ? `TotalDeaths${typeSort}` : `NewDeaths${typeSort}`;
          case 'recovered':
            return this.periodTotal ? `TotalRecovered${typeSort}` : `NewRecovered${typeSort}`;
          default:
            return `TotalConfirmed${typeSort}`;
        }
      };

      const keySort = this.populationTotal ? getKey() : getKey('100k');

      return b[keySort] - a[keySort];
    });
  }
}
