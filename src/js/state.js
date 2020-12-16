export default class State {
  constructor() {
    this.data = null;
    this.activeCountry = 'all';
    this.period = 'all'; // all, day
    this.per100k = false;
    this.index = 'cases'; // cases, deaths, recovered
  }

  set(key, value) {
    this[key] = value;
    document.dispatchEvent(new Event('updateState', { bubbles: true }));
  }
}
