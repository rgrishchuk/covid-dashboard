import State from './state';
import CovidMap from './Modules/map';
import Countries from './Modules/countries/countries';
import Table from './Modules/table';
import CovidChart from './Modules/chart';

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
    this.modules.push(new CovidChart(this.state));
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

  updateData(data) {
    this.state.set.data = data;
    this.state.data.Global.TotalDeaths = 0;
    this.state.data.Countries[0].TotalDeaths = 0;
    this.state.data.Countries[0].timeline = null;
    // this.state.data.Countries.shift();
    if (this.state.currentCountry !== 'global') {
      const currCountry = this.state.data.Countries.find((country) => {
        if (country.Country === this.state.currentCountry) return true;
        return false;
      });
      if (!currCountry) this.state.currentCountry = 'global';
    }
    this.modules.forEach((module) => {
      module.reset();
    });
  }
}
