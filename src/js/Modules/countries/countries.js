import components from '../../components/components';
import keyboard from './virtualKeyboard';

export default class Countries {
  constructor(state) {
    this.curCountry = '';
    this.state = state;
    this.container = document.querySelector('.main__container .countries');
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
    this.setStateRate();
    components.setValueRadioBtn(this);
    components.setStatePeriodAndPopulation(this);
    components.toggleSizeContainer(this.btnFull, this.container);
  }

  update() {
    this.createListCountries();
    this.setValueSelect();
    components.setValueRadioBtn(this);
  }

  createListCountries() {
    this.listCountries.innerHTML = '';
    this.state.data.Countries.forEach((el) => {
      const item = document.createElement('li');
      item.classList.add('item');
      item.innerHTML = `
      <div class="text">
        <span class="count">
        ${components.getDataCountry(this.state, el, this.state.currentRate)}
        </span>
        <span class="name-country">${el.Country}</span>
      </div>
      <img class="flag" src="${el.flag}">`;
      item.addEventListener('click', () => {
        this.curCountry = el.Country;
        this.state.set('currentCountry', el.Country);
      });

      if (this.curCountry) {
        /* eslint-disable-next-line */
        for (const elem of this.listCountries.children) {
          const nameCountry = elem.firstElementChild.lastElementChild.textContent;
          if (this.curCountry === nameCountry) {
            elem.classList.add('active');
          } else {
            elem.classList.remove('active');
          }
        }
      }
      this.listCountries.append(item);
    });
  }

  searchCountry() {
    const input = document.querySelector('.input-country');

    function search(value, listCountries) {
      /* eslint-disable-next-line */
      for (const elem of listCountries.children) {
        if (value.length === 0) elem.classList.remove('hide');

        const nameCountry = elem.firstElementChild.lastElementChild.textContent;
        if (nameCountry.toLowerCase().startsWith(value.toLowerCase())) {
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

  setStateRate() {
    this.select.addEventListener('change', (e) => {
      this.state.set('currentRate', e.target.value);
    });
  }

  setValueSelect() {
    this.select.value = this.state.currentRate;
  }
}
