/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
// import countryBorders from '../Resources/countries.geojson';

export default class CovidMap {
  constructor(state) {
    this.state = state;
    this.rateRadioButton = document.getElementsByName('map__rate');
    this.checkbox100k = document.getElementById('map__per100k');
    this.periodRadioButton = document.getElementsByName('map__period');
  }

  getKey() {
    let key;
    if (this.state.periodTotal) key = 'Total';
    else key = 'New';
    if (this.state.currentRate === 'confirmed') key += 'Confirmed';
    else if (this.state.currentRate === 'recovered') key += 'Recovered';
    else if (this.state.currentRate === 'deaths') key += 'Deaths';
    if (!this.state.populationTotal) key += '100k';
    return key;
  }

  getRate(country) {
    const key = this.getKey();
    return country[key];
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

  createMarker(country) {
    const value = this.getRate(country);
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
    marker.addEventListener('click', (e) => {
      // eslint-disable-next-line no-underscore-dangle
      const selCountry = this.findCountryByLatLng(e.target._latlng);
      if (selCountry) this.state.set('currentCountry', selCountry.Country);
    });
    marker.bindPopup(`${country.Country}: ${value}`).openPopup();
    return marker;
  }

  addMarkers() {
    this.markers = [];
    this.state.data.Countries.forEach((country) => {
      const value = this.getRate(country);
      const marker = this.createMarker(country);
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  // onMapClick(e) {
  //   console.log(e.latlng);
  // }

  findCountryByLatLng(latlng) {
    return this.state.data.Countries.find((country) => {
      if (country.latlng[0] === latlng.lat && country.latlng[1] === latlng.lng) return true;
      return false;
    });
  }

  findCountryByAlpha3Code(code) {
    return this.state.data.Countries.find((country) => {
      if (country.alpha3Code === code) return country;
      return false;
    });
  }

  findBorderCountry(country) {
    return countryBorders.features.find((item) => {
      if (item.properties.ISO_A3 === country.alpha3Code) return item.geometry;
      return false;
    });
  }

  addBorders() {
    this.borders = [];
    this.state.data.Countries.forEach((country) => {
      const settings = {
        fillColor: 'red',
        color: 'red',
        opacity: 0,
        fillOpacity: 0,
      };
      const border = this.findBorderCountry(country);
      if (border) {
        const borderLayer = L.geoJSON(border, settings);
        borderLayer.on({
          mouseover: (e) => {
            e.target.setStyle({
              opacity: 1,
              fillOpacity: 0.2,
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              e.target.bringToFront();
            }
          },
          mouseout: (e) => {
            e.target.setStyle({
              opacity: 0,
              fillOpacity: 0,
            });
          },
          click: (e) => {
            this.map.fitBounds(e.target.getBounds());
            const selCountry = this.findCountryByAlpha3Code(e.target.countryCode);
            if (selCountry) this.state.set('currentCountry', selCountry.Country);
          },
        });
        borderLayer.bindTooltip(`${country.Country}: ${this.getRate(country)}`, { sticky: true });
        borderLayer.addTo(this.map);
        borderLayer.countryCode = country.alpha3Code;
        this.borders.push(borderLayer);
      }
    });
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

    const legend = this.createMapLegend();
    legend.addTo(this.map);
    this.addMarkers();
    this.addBorders();

    const mapboxAccessToken = 'pk.eyJ1IjoicnVzZyIsImEiOiJja2l1dnJibnExOGV2MnFzYzM0Mm5uMW0wIn0.OFkwnryOwE1hvAipLOZLLQ';
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
      id: 'mapbox/light-v9',
    }).addTo(this.map);
  }

  addListeners() {
    this.rateRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        // console.log(`change ${button.value}`);
        this.state.set('currentRate', button.value);
      });
    });
    this.periodRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        // console.log(`change ${button.value}`);
        let value = false;
        if (button.value === 'all') value = true;
        this.state.set('periodTotal', value);
      });
    });
    this.checkbox100k.addEventListener('change', () => {
      // console.log(this.checkbox100k.checked);
      this.state.set('populationTotal', !this.checkbox100k.checked);
    });
  }

  render() {
    document.querySelector('.map #icon-full-map').addEventListener('click', () => {
      document.querySelector('.map').classList.toggle('fullscreen');
      this.map.invalidateSize(true);
    });
    this.createMap();
    this.addListeners();
  }

  updateButtonsState() {
    // console.log('update buttons');
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

  deleteMarkers() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  findCountryByName(country) {
    return this.state.data.Countries.find((item) => {
      if (item.Country === country) return true;
      return false;
    });
  }

  mapCenteredByCountry(country) {
    const objCountry = this.findCountryByName(country);
    if (objCountry) {
      this.map.panTo(new L.LatLng(objCountry.latlng[0], objCountry.latlng[1]));
    }
  }

  findMarker(latlng) {
    // console.log(latlng);
    return this.markers.find((marker) => {
      // eslint-disable-next-line no-underscore-dangle
      if (marker._latlng.lat === latlng[0] && marker._latlng.lng === latlng[1]) return true;
      return false;
    });
  }

  updateMarkers() {
    this.deleteMarkers();
    this.addMarkers();
    if (this.state.currentCountry !== 'global') {
      this.mapCenteredByCountry(this.state.currentCountry);
      const marker = this.findMarker(this.findCountryByName(this.state.currentCountry).latlng);
      if (marker) marker.openPopup();
    }
  }

  deleteBorders() {
    this.borders.forEach((borderLayer) => {
      this.map.removeLayer(borderLayer);
    });
  }

  updateBorders() {
    this.borders.forEach((borderLayer) => {
      borderLayer.unbindTooltip();
      const country = this.findCountryByAlpha3Code(borderLayer.countryCode);
      if (country) borderLayer.bindTooltip(`${country.Country}: ${this.getRate(country)}`, { sticky: true });
    });
  }

  update() {
    // console.log('changed state!!!');
    this.updateButtonsState();
    this.updateMarkers();
    this.updateBorders();
  }
}
