export default class Countries {
  constructor(state) {
    this.state = state;
    this.container = document.querySelector('.countries');
    this.listCountries = document.querySelector('.list-countries');
    this.select = document.querySelector('.dropdown-select');
    this.btnAllPeriod = document.querySelector('.btn-all-period');
    this.btnLastDay = document.querySelector('.btn-last-day');
    this.btnTotalCases = document.querySelector('.btn-total-cases');
    this.btnPer100k = document.querySelector('.btn-per-100k');
    this.btnFull = document.querySelector('.btn-full-countries');
  }

  render() {
    this.createListCountries();
    this.searchCountry();
    this.setState();
    this.toggleSizeContainer();
  }

  update() {
    this.setValueSelect();
    this.setValueRadioBtn();
    this.createListCountries();
  }

  toggleSizeContainer() {
    this.btnFull.addEventListener('click', () => {
      this.container.classList.toggle('full');
    });
  }

  createListCountries() {
    this.listCountries.innerHTML = '';
    this.state.data.Countries.forEach((el) => {
      const item = document.createElement('li');
      item.classList.add('item');
      item.innerHTML = `
      <div class="text">
        <span class="count">${this.getDataForCountry(el)}</span>
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

  getDataForCountry(el) {
    let res;
    const { peridotTotal, populationTotal, currentRate } = this.state;
    const calcDataPer100k = (num) => Math.round((num / el.population) * 100000);
    const getDataBasedOnSettings = (totalCases, newCases) => {
      if (peridotTotal && !populationTotal) return calcDataPer100k(totalCases);
      if (!peridotTotal && !populationTotal) return calcDataPer100k(newCases);
      if (!peridotTotal && populationTotal) return newCases;
      return totalCases;
    };

    switch (currentRate) {
      case 'confirmed':
        res = getDataBasedOnSettings(el.TotalConfirmed, el.NewConfirmed);
        break;
      case 'deaths':
        res = getDataBasedOnSettings(el.TotalDeaths, el.NewDeaths);
        break;
      case 'recovered':
        res = getDataBasedOnSettings(el.TotalRecovered, el.NewRecovered);
        break;
      default:
        res = el.TotalConfirmed;
    }

    return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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

  setState() {
    const setValue = (key, value) => {
      this.state.set(key, value);
    };
    this.btnAllPeriod.addEventListener('change', setValue.bind(this, 'peridotTotal', true));
    this.btnLastDay.addEventListener('change', setValue.bind(this, 'peridotTotal', false));
    this.btnTotalCases.addEventListener('change', setValue.bind(this, 'populationTotal', true));
    this.btnPer100k.addEventListener('change', setValue.bind(this, 'populationTotal', false));
    this.select.addEventListener('change', (e) => {
      this.state.set('currentRate', e.target.value);
    });
  }

  setValueSelect() {
    this.select.value = this.state.currentRate;
  }

  setValueRadioBtn() {
    this.btnAllPeriod.checked = this.state.peridotTotal;
    this.btnTotalCases.checked = this.state.populationTotal;
  }
}
