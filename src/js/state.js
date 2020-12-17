export default class State {
  constructor() {
    this.data = null;
    this.currentRate = 'confirmed';
    this.currentCountry = 'global';
    this.peridotTotal = true;
    this.populationTotal = true;
  }

  set(key, value) {
    this[key] = value;
    this.data.Countries = this.sortCovidData(this.data);
    document.dispatchEvent(new Event('updateState', { bubbles: true }));
  }

  // TODO add sort per 100k
  sortCovidData(data) {
    return data.Countries.sort((a, b) => {
      let keySort;
      switch (this.currentRate) {
        case 'confirmed':
          keySort = this.peridotTotal ? 'TotalConfirmed' : 'NewConfirmed';
          break;
        case 'deaths':
          keySort = this.peridotTotal ? 'TotalDeaths' : 'NewDeaths';
          break;
        case 'recovered':
          keySort = this.peridotTotal ? 'TotalRecovered' : 'NewRecovered';
          break;
        default:
          keySort = 'TotalConfirmed';
      }

      return b[keySort] - a[keySort];
    });
  }
}
