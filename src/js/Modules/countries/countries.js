import keyboard from './virtualKeyboard';

export default class Countries {
  constructor(state) {
    this.state = state;
    this.container = document.querySelector('.countries');
    this.listCountries = document.querySelector('.list-countries');
    this.select = document.querySelector('.dropdown-select');
    this.btnAllPeriod = document.querySelector('.countries__buttons .btn-all-period');
    this.btnLastDay = document.querySelector('.countries__buttons .btn-last-day');
    this.btnTotalCases = document.querySelector('.countries__buttons .btn-total-cases');
    this.btnPer100k = document.querySelector('.countries__buttons .btn-per-100k');
    this.btnFull = document.querySelector('.btn-full-countries');
  }

  render() {
    this.createListCountries();
    this.searchCountry();
    this.setState();
    this.setValueRadioBtn();
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
        <span class="count">${this.getDataCountry(el, this.state.currentRate)}</span>
        <span class="name-country">${el.Country}</span>
      </div>
      <img class="flag" src="${el.flag}">`;
      // TODO add active item
      item.addEventListener('click', () => {
        /* eslint-disable-next-line */
        for (const elem of this.listCountries.children) {
          elem.classList.remove('active');
        }
        this.state.set('currentCountry', el.Country);
        item.classList.add('active');
      });

      this.listCountries.append(item);
    });
  }

  getDataCountry(data, currentRate) {
    let res;
    const { peridotTotal, populationTotal } = this.state;
    const calcDataPer100k = (num) => Math.round((num / data.population) * 100000);
    const getDataBasedOnSettings = (totalCases, newCases) => {
      if (peridotTotal && !populationTotal) return calcDataPer100k(totalCases);
      if (!peridotTotal && !populationTotal) return calcDataPer100k(newCases);
      if (!peridotTotal && populationTotal) return newCases;
      return totalCases;
    };

    switch (currentRate) {
      case 'confirmed':
        res = getDataBasedOnSettings(data.TotalConfirmed, data.NewConfirmed);
        break;
      case 'deaths':
        res = getDataBasedOnSettings(data.TotalDeaths, data.NewDeaths);
        break;
      case 'recovered':
        res = getDataBasedOnSettings(data.TotalRecovered, data.NewRecovered);
        break;
      default:
        res = data.TotalConfirmed;
    }
    return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  searchCountry() {
    const input = document.querySelector('.input-country');

    function search(value, listCountries) {
      /* eslint-disable-next-line */
      for (const elem of listCountries.children) {
        if (value.length === 0) elem.classList.remove('hide');

        const textElem = elem.firstElementChild.lastElementChild.textContent;
        if (textElem.toLowerCase().startsWith(value.toLowerCase())) {
          elem.classList.remove('hide');
        } else {
          elem.classList.add('hide');
        }
      }
    }

    input.addEventListener('input', (e) => {
      const { value } = e.target;
      search(value, this.listCountries);
    });

    keyboard.init(search, this.listCountries, input);
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
    this.btnLastDay.checked = !this.state.peridotTotal;
    this.btnTotalCases.checked = this.state.populationTotal;
    this.btnPer100k.checked = !this.state.populationTotal;
  }
}
