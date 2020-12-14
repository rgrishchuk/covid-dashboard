function lastUpdate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  document.querySelector('#lastUpdate').innerHTML = `Last updated: ${new Date(date).toLocaleString('en-US', options)}`;
}

export default class App {
  constructor() {
    this.state = {};
  }

  init(data) {
    this.state.data = data;
    lastUpdate(data.Date);
  }
}
