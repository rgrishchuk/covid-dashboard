export default class Table {
  constructor(state) {
    this.state = state;
    this.container = document.querySelector('.main__container .main__container__right .table');
    this.valueTable = document.querySelectorAll('.table__content .item span');
    this.radioBtn = document.querySelectorAll('input[data-radio-btn]');
    this.title = document.querySelector('.table__title .title');
    this.btnAllPeriod = document.querySelector('.table__buttons .btn-all-period');
    this.btnLastDay = document.querySelector('.table__buttons .btn-last-day');
    this.btnTotalCases = document.querySelector('.table__buttons .btn-total-cases');
    this.btnPer100k = document.querySelector('.table__buttons .btn-per-100k');
    this.btnFull = document.querySelector('.btn-full-table');
  }

  render() {
    this.renderTable();
    this.toggleSizeContainer();
    this.setState();
    this.setValueRadioBtn();
  }

  update() {
    this.renderTable();
    this.setValueRadioBtn();
  }

  renderTable() {
    const { currentCountry, data } = this.state;
    if (currentCountry === 'global') {
      this.title.textContent = 'Global';
      this.setValuesTable(data.Global);
    } else {
      const dataCountry = data.Countries.find((el) => el.Country === currentCountry);
      this.title.textContent = dataCountry.Country;
      this.setValuesTable(dataCountry);
    }
  }

  setValuesTable(data) {
    this.valueTable.forEach((el) => {
      const elem = el;
      const attr = elem.getAttribute('data-table');
      if (attr === 'confirmed') elem.textContent = this.getDataCountry(data, 'confirmed');
      if (attr === 'deaths') elem.textContent = this.getDataCountry(data, 'deaths');
      if (attr === 'recovered') elem.textContent = this.getDataCountry(data, 'recovered');
    });
  }

  /// Kopipasta

  toggleSizeContainer() {
    this.btnFull.addEventListener('click', () => {
      this.container.classList.toggle('full');
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

  setState() {
    const setValue = (key, value) => {
      this.state.set(key, value);
    };
    this.btnAllPeriod.addEventListener('change', setValue.bind(this, 'peridotTotal', true));
    this.btnLastDay.addEventListener('change', setValue.bind(this, 'peridotTotal', false));
    this.btnTotalCases.addEventListener('change', setValue.bind(this, 'populationTotal', true));
    this.btnPer100k.addEventListener('change', setValue.bind(this, 'populationTotal', false));
  }

  setValueRadioBtn() {
    this.btnAllPeriod.checked = this.state.peridotTotal;
    this.btnLastDay.checked = !this.state.peridotTotal;
    this.btnTotalCases.checked = this.state.populationTotal;
    this.btnPer100k.checked = !this.state.populationTotal;
  }
}
