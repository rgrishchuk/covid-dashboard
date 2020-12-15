/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
export default class Map {
  constructor(state) {
    this.state = state;
  }

  createMap() {
    const mapContent = document.querySelector('.map__content');
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map__container';
    mapContainer.style.height = '100%';
    mapContainer.style.width = '100%';
    mapContent.appendChild(mapContainer);

    const mapOptions = {
      center: [53, 28],
      zoom: 5,
    };
    const map = new L.map('map__container', mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer);
  }

  render() {
    console.log(this.state);
    this.createMap();
  }

  update() {
    console.log('update Map');
    console.log(this.state);
  }
}
