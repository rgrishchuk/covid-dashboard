export default class State {
  constructor() {
    this.data = null;
  }

  set(key, value) {
    this[key] = value;
    document.dispatchEvent(new Event('updateState', { bubbles: true }));
  }
}
