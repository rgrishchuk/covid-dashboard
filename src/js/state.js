import components from './components/components';

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
      const keySort = components.getKey.call(this, this.currentRate);
      return b[keySort] - a[keySort];
    });
  }
}
