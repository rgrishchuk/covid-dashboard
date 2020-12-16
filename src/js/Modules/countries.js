export default class Countries {
  constructor(state) {
    this.state = state;
    this.currentSelect = 'confirmed';
    this.listCountries = document.querySelector('.list-countries');
    this.btnAllPeriod = document.querySelector('.btn-all-period');
    this.btnLastDay = document.querySelector('.btn-last-day');
    this.btnTotalCases = document.querySelector('.btn-total-cases');
    this.btnPer100k = document.querySelector('.btn-per-100k');
  }

  render() {
    this.createListCountries();
    this.searchCountry();
    this.setDateRate();
    this.setPeriod();
    this.setPopulation();
  }

  update() {
    this.btnAllPeriod.checked = this.state.peridotTotal;
    this.btnLastDay.checked = !this.state.peridotTotal;
    this.btnTotalCases.checked = this.state.populationTotal;
    this.btnPer100k.checked = !this.state.populationTotal;
    this.createListCountries();
  }

  createListCountries() {
    this.listCountries.innerHTML = '';
    this.state.data.Countries.forEach((el) => {
      const item = document.createElement('li');
      item.classList.add('item');
      item.innerHTML = `
      <div class="text">
        <span class="count">${this.getDataRate(el)}</span>
        <span class="name-country">${el.Country}</span>
      </div>
      <img class="flag" src="${el.flag}">`;

      item.addEventListener('click', () => {
        /* eslint-disable-next-line */
        for (const elem of this.listCountries.children) {
          elem.classList.remove('active');
        }
        item.classList.add('active');
        this.state.set('currentCountry', el.Country);
      });

      this.listCountries.append(item);
    });
  }

  setDateRate() {
    const select = document.querySelector('.dropdown-select');
    select.addEventListener('change', (e) => {
      this.state.set('currentRate', e.target.value);
    });
  }

  getDataRate(el) {
    let result;
    const { peridotTotal, populationTotal, currentRate } = this.state;
    const getDataPer100k = (num) => Math.round((num / el.population) * 100000);

    switch (currentRate) {
      case 'confirmed':
        if (peridotTotal && populationTotal) result = el.TotalConfirmed;
        if (peridotTotal && !populationTotal) result = el.NewConfirmed;
        if (!peridotTotal && populationTotal) result = getDataPer100k(el.TotalConfirmed);
        if (!peridotTotal && !populationTotal) result = getDataPer100k(el.NewConfirmed);
        break;
      case 'deaths':
        if (peridotTotal && populationTotal) result = el.TotalDeaths;
        if (peridotTotal && !populationTotal) result = el.NewDeaths;
        if (!peridotTotal && populationTotal) result = getDataPer100k(el.TotalDeaths);
        if (!peridotTotal && !populationTotal) result = getDataPer100k(el.NewDeaths);
        break;
      case 'recovered':
        if (peridotTotal && populationTotal) result = el.TotalRecovered;
        if (peridotTotal && !populationTotal) result = el.NewRecovered;
        if (!peridotTotal && populationTotal) result = getDataPer100k(el.TotalRecovered);
        if (!peridotTotal && !populationTotal) result = getDataPer100k(el.NewRecovered);
        break;
      default:
    }

    return result;
  }

  searchCountry() {
    const input = document.querySelector('.input-country');
    input.addEventListener('input', (e) => {
      const { value } = e.target;
      /* eslint-disable-next-line */
      for (const elem of this.listCountries.children) {
        if (value.length === 0) elem.classList.remove('hide');

        const textElem = elem.firstElementChild.lastElementChild.textContent;
        if (textElem.toLowerCase().startsWith(value.toLowerCase())) {
          elem.classList.remove('hide');
        } else {
          elem.classList.add('hide');
        }
      }
    });
  }

  setPeriod() {
    this.btnAllPeriod.addEventListener('change', () => {
      this.state.set('peridotTotal', true);
    });

    this.btnLastDay.addEventListener('change', () => {
      this.state.set('peridotTotal', false);
    });
  }

  setPopulation() {
    this.btnTotalCases.addEventListener('change', () => {
      this.state.set('populationTotal', true);
    });

    this.btnPer100k.addEventListener('change', () => {
      this.state.set('populationTotal', false);
    });
  }
}
