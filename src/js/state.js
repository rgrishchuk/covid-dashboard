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
    document.dispatchEvent(new Event('updateState', { bubbles: true }));
  }
}
