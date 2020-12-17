/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
export default class Map {
  constructor(state) {
    this.state = state;
    // this.loacalState = {};
    // this.setLocalState();
    this.rateRadioButton = document.getElementsByName('map__rate');
    this.checkbox100k = document.getElementById('map__per100k');
    this.periodRadioButton = document.getElementsByName('map__period');
  }

  // setLocalState() {
  //   this.loacalState.currentRate = this.state.currentRate;
  //   this.loacalState.currentCountry = this.state.currentCountry;
  //   this.loacalState.peridotTotal = this.state.peridotTotal;
  //   this.loacalState.populationTotal = this.state.populationTotal;
  // }

  // isChangedState() {
  //   if (this.loacalState.currentRate !== this.state.currentRate
  //     || this.loacalState.currentCountry !== this.state.currentCountry
  //     || this.loacalState.peridotTotal !== this.state.peridotTotal
  //     || this.loacalState.populationTotal !== this.state.populationTotal) return true;
  //   return false;
  // }

  getKey() {
    let key;
    if (this.state.periodTotal) key = 'Total';
    else key = 'New';
    if (this.state.currentRate === 'confirmed') key += 'Confirmed';
    else if (this.state.index === 'recovered') key += 'Recovered';
    else key += 'Deaths';
    if (!this.state.populationTotal) key += '100k';
    return key;
  }

  getIndex(country) {
    const key = this.getKey();
    return country[key];
  }

  markerSize(value) {
    if (value < 100) return 5;
    return 10;
  }

  generateLabelsForLegend() {
    return ['<div class="color1"></div><span> + 5 000 000</span>',
      '<div class="color2"></div><span> < 5 000 000</span>',
      '<div class="color3"></div><span> < 1 000 000</span>',
      '<div class="color4"></div><span> < 500 000</span>',
      '<div class="color5"></div><span> < 250 000</span>',
      '<div class="color6"></div><span> < 100 000</span>',
      '<div class="color7"></div><span> < 50 000</span>',
      '<div class="color8"></div><span> < 25 000</span>',
      '<div class="color9"></div><span> < 10 000</span>',
      '<div class="color10"></div><span> < 5 000</span>',
      '<div class="color11"></div><span> < 2 500</span>',
      '<div class="color12"></div><span> < 1 000</span>',
      '<div class="color13"></div><span> < 500</span>',
      '<div class="color14"></div><span> < 250</span>',
      '<div class="color15"></div><span> < 100</span>',
      '<div class="color16"></div><span> < 50</span>',
      '<div class="color17"></div><span> < 25</span>',
      '<div class="color18"></div><span> < 5</span>'];
  }

  createMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    const labels = this.generateLabelsForLegend();
    legend.onAdd = (map) => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML = labels.join('');
      return div;
    };
    return legend;
  }

  getIconSize(value) {
    if (value > 5000000) return [50, 50];
    if (value > 1000000) return [48, 48];
    if (value > 500000) return [46, 46];
    if (value > 250000) return [44, 44];
    if (value > 100000) return [42, 42];
    if (value > 50000) return [40, 40];
    if (value > 25000) return [38, 38];
    if (value > 10000) return [36, 36];
    if (value > 5000) return [34, 34];
    if (value > 2500) return [32, 32];
    if (value > 1000) return [30, 30];
    if (value > 500) return [28, 28];
    if (value > 250) return [26, 26];
    if (value > 100) return [24, 24];
    if (value > 50) return [22, 22];
    if (value > 25) return [20, 20];
    if (value > 5) return [18, 18];
    return [15, 15];
  }

  getIconClassName(value) {
    if (value > 5000000) return 'icon-circle color1';
    if (value > 1000000) return 'icon-circle color2';
    if (value > 500000) return 'icon-circle color3';
    if (value > 250000) return 'icon-circle color4';
    if (value > 100000) return 'icon-circle color5';
    if (value > 50000) return 'icon-circle color6';
    if (value > 25000) return 'icon-circle color7';
    if (value > 10000) return 'icon-circle color8';
    if (value > 5000) return 'icon-circle color9';
    if (value > 2500) return 'icon-circle color10';
    if (value > 1000) return 'icon-circle color11';
    if (value > 500) return 'icon-circle color12';
    if (value > 250) return 'icon-circle color13';
    if (value > 100) return 'icon-circle color14';
    if (value > 50) return 'icon-circle color15';
    if (value > 25) return 'icon-circle color16';
    if (value > 5) return 'icon-circle color17';
    return 'icon-circle color18';
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
      attributionControl: false,
      worldCopyJump: true,
    };
    this.map = new L.map('map__container', mapOptions);
    const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    this.map.addLayer(layer);

    const legend = this.createMapLegend();
    legend.addTo(this.map);

    this.state.data.Countries.forEach((country) => {
      const value = this.getIndex(country);
      const iconOptions = {
        className: this.getIconClassName(value),
        iconSize: this.getIconSize(value),
      };
      const customIcon = L.divIcon(iconOptions);

      const markerOptions = {
        title: `${country.Country}: ${value}`,
        clickable: true,
        draggable: false,
        icon: customIcon,
      };
      const marker = new L.Marker(country.latlng, markerOptions);
      marker.bindPopup(`${country.Country}: ${value}`).openPopup();
      marker.addTo(this.map);
    });
  }

  addListeners() {
    this.rateRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        console.log(`change ${button.value}`);
        this.state.set('currentRate', button.value);
      });
    });
    this.periodRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        console.log(`change ${button.value}`);
        let value = false;
        if (button.value === 'all') value = true;
        this.state.set('periodTotal', value);
      });
    });
    this.checkbox100k.addEventListener('change', () => {
      console.log(this.checkbox100k.checked);
      this.state.set('populationTotal', !this.checkbox100k.checked);
    });
  }

  render() {
    document.querySelector('.map #icon-full').addEventListener('click', () => {
      document.querySelector('.map').classList.toggle('fullscreen');
      this.map.invalidateSize(true);
    });
    this.createMap();
    this.addListeners();
  }

  updateButtonsState() {
    console.log('update buttons');
    this.rateRadioButton.forEach((button) => {
      const btn = button;
      if (button.value === this.state.currentRate) {
        btn.checked = true;
      }
    });
    if (this.state.periodTotal) {
      this.periodRadioButton[0].checked = true;
    } else {
      this.periodRadioButton[1].checked = true;
    }
    this.checkbox100k.checked = !this.state.populationTotal;
  }

  update() {
    console.log('changed state!!!');
    this.updateButtonsState();
  }
}
