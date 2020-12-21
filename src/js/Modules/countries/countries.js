import keyboard from './virtualKeyboard';

const { components } = require('../../components/components');

export default class Countries {
  constructor(state) {
    this.valueInput = '';
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
    components.setValueRadioBtn.call(this);
    components.setStatePeriodAndPopulation.call(this);
    components.toggleSizeContainer.call(this);
  }

  update() {
    this.createListCountries();
    this.setValueSelect();
    this.setValueCountry();
    components.setValueRadioBtn.call(this);
  }

  createListCountries() {
    this.listCountries.innerHTML = '';
    this.state.data.Countries.forEach((el) => {
      const item = document.createElement('li');
      item.classList.add('item');
      item.innerHTML = `
      <div class="text">
        <span class="count">
        ${components.getDataCountry(this, el, this.state.currentRate)}
        </span>
        <span class="name-country">${el.Country}</span>
      </div>
      <img class="flag" src="${el.flag}">`;
      item.addEventListener('click', () => {
        this.state.set('currentCountry', el.Country);
      });
      this.listCountries.append(item);
    });
  }

  searchCountry() {
    const input = document.querySelector('.input-country');

    function filterListCountry(value, listCountries) {
      const listElem = listCountries.children;
      for (let i = 0; i < listElem.length; i += 1) {
        if (value.length === 0) listElem[i].classList.remove('hide');

        const nameCountry = listElem[i].firstElementChild.lastElementChild.textContent;
        if (nameCountry.toLowerCase().startsWith(value.toLowerCase())) {
          listElem[i].classList.remove('hide');
        } else {
          listElem[i].classList.add('hide');
        }
      }
    }

    function search(value) {
      const elCountry = this.state.data.Countries.find((el) => el.Country.toLowerCase() === value);
      if (elCountry !== undefined) this.state.set('currentCountry', elCountry.Country);
    }

    input.addEventListener('input', (event1) => {
      const { value } = event1.target;
      this.valueInput = value;
      filterListCountry(value, this.listCountries);
    });

    input.addEventListener('focus', () => {
      document.addEventListener('keydown', (event2) => {
        if (event2.keyCode === 13) {
          search.call(this, this.valueInput);
          keyboard.close();
          input.blur();
        }
      });
    });

    keyboard.init(filterListCountry, this, input, search);
  }

  setStateRate() {
    this.select.addEventListener('change', (e) => {
      this.state.set('currentRate', e.target.value);
    });
  }

  setValueCountry() {
    let indexCurCountry;
    const heightElem = this.listCountries.children[0].clientHeight + 1; // 1 = border
    const elemList = this.listCountries.children;

    if (this.state.currentCountry) {
      for (let i = 0; i < elemList.length; i += 1) {
        const textCountry = elemList[i].firstElementChild.lastElementChild.textContent;
        if (this.state.currentCountry === textCountry) {
          indexCurCountry = i;
          elemList[i].classList.add('active');
        } else {
          elemList[i].classList.remove('active');
        }
      }
    }

    this.scrollListCountries(indexCurCountry, heightElem);
  }

  scrollListCountries(indexCurCountry, heightElem) {
    if (indexCurCountry >= 3) {
      this.listCountries.scrollTo({ top: (indexCurCountry - 3) * heightElem, behavior: 'smooth' });
    } else {
      this.listCountries.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setValueSelect() {
    this.select.value = this.state.currentRate;
  }
}
