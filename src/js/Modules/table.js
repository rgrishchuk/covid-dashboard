export default class Table {
  constructor(state) {
    this.state = state;
    this.valueTable = document.querySelectorAll('div[data-table]');
  }

  render() {
    this.renderRow();
  }

  update() {
    this.renderRow();
  }

  renderRow() {
    const { currentCountry, data } = this.state;
    if (currentCountry === 'global') {
      this.setValueTable(data.Global);
    } else {
      const dataCountry = data.Countries.find((el) => el.Country === currentCountry);
      this.setValueTable(dataCountry);
    }
  }

  setValueTable(data) {
    this.valueTable.forEach((el) => {
      const value = el;
      const attr = value.getAttribute('data-table');
      if (attr === 'confirmed') value.textContent = this.getDataCountry(data, 'confirmed');
      if (attr === 'deaths') value.textContent = this.getDataCountry(data, 'deaths');
      if (attr === 'recovered') value.textContent = this.getDataCountry(data, 'recovered');
    });
  }

  /// Kopipasta

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
    console.log(res);
    return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
