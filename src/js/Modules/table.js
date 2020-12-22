const { components } = require('../components/components');

export default class Table {
  constructor(state) {
    this.state = state;
    this.container = document.querySelector('.main__container .main__container__right .table');
    this.valueTable = document.querySelectorAll('.table__content .item span');
    this.blockTitle = document.querySelector('.table__title .block-title');
    this.btnAllPeriod = document.querySelector('.table__buttons .btn-all-period');
    this.btnLastDay = document.querySelector('.table__buttons .btn-last-day');
    this.btnTotalCases = document.querySelector('.table__buttons .btn-total-cases');
    this.btnPer100k = document.querySelector('.table__buttons .btn-per-100k');
    this.btnFull = document.querySelector('.btn-full-table');
  }

  render() {
    this.renderTable();
    components.setValueRadioBtn.call(this);
    components.setStatePeriodAndPopulation.call(this);
    components.toggleSizeContainer.call(this);
  }

  update() {
    this.renderTable();
    components.setValueRadioBtn.call(this);
  }

  reset() {
    this.update();
  }

  renderTable() {
    const { currentCountry, data } = this.state;
    if (currentCountry === 'global') {
      this.blockTitle.innerHTML = '<h3 class="title">Global</h3> <img class="img-global" src="https://spec-elcom.ru/assets/uploads/1-index.png" alt="global">';
      this.setValuesTable(data.Global);
    } else {
      const dataCountry = data.Countries.find((el) => el.Country === currentCountry);
      this.blockTitle.innerHTML = `<h3 class="title">${dataCountry.Country}</h3> <img class="img-country" src="${dataCountry.flag}" alt="flag">`;
      this.setValuesTable(dataCountry);
    }
  }

  setValuesTable(data) {
    this.valueTable.forEach((elem) => {
      const value = elem;
      const attr = value.getAttribute('data-table');
      if (attr === 'confirmed') value.textContent = components.getDataCountry(this, data, attr);
      if (attr === 'deaths') value.textContent = components.getDataCountry(this, data, attr);
      if (attr === 'recovered') value.textContent = components.getDataCountry(this, data, attr);
    });
  }
}
