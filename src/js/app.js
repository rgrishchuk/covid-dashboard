import State from './state';
import Map from './Modules/map';
import Countries from './Modules/countries/countries';
import Table from './Modules/table';
import Chart from './Modules/chart';

function lastUpdate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  document.querySelector('#lastUpdate').innerHTML = `Last updated: ${new Date(date).toLocaleString(
    'en-US',
    options,
  )}`;
}

export default class App {
  constructor() {
    this.state = new State();
    this.modules = [];
    this.modules.push(new CovidMap(this.state));
    this.modules.push(new Countries(this.state));
    this.modules.push(new Table(this.state));
    this.modules.push(new Chart(this.state));
  }

  init(data) {
    if (data) {
      this.state.set('data', data);
      lastUpdate(data.Date);
    }
    this.render();
    document.addEventListener('updateState', () => {
      this.update();
    });
  }

  render() {
    this.modules.forEach((module) => {
      module.render();
    });
  }

  update() {
    this.modules.forEach((module) => {
      module.update();
    });
  }
}
