/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
export default class Map {
  constructor(state) {
    this.state = state;
  }

  getIndex(country) {
    let key;
    if (this.state.period === 'all') key = 'Total';
    else key = 'New';
    if (this.state.index === 'cases') key += 'Confirmed';
    else if (this.state.index === 'recovered') key += 'Recovered';
    else key += 'Deaths';
    if (this.state.per100k) key += '100k';
    return country[key];
  }

  createMap() {
    const mapContent = document.querySelector('.map__content');
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map__container';
    mapContainer.style.height = '100%';
    mapContainer.style.width = '100%';
    mapContent.appendChild(mapContainer);

    // const attrOptions = {
    //   prefix: 'attribution sample',
    // };
    // const attr = L.control.attribution(attrOptions);
    const mapOptions = {
      center: [53, 28],
      zoom: 5,
      attributionControl: false,
    };
    this.map = new L.map('map__container', mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    // L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png').addTo(map);
    // attr.addTo(map);
    this.map.addLayer(layer);

    this.state.data.Countries.forEach((country) => {
      const markerOptions = {
        title: `${country.Country}  ${this.getIndex(country)}`,
        clickable: true,
        draggable: false,
      };
      const marker = new L.Marker(country.latlng, markerOptions);
      marker.addTo(this.map);
    });
  }

  render() {
    document.querySelector('.map #icon-full').addEventListener('click', () => {
      document.querySelector('.map').classList.toggle('fullscreen');
      this.map.invalidateSize(true);
    });

    console.log(this.state);
    this.createMap();
  }

  update() {
    console.log('update Map');
    console.log(this.state);
  }
}
