class Components {
  getKey(currentRate) {
    const data = this.state === undefined ? this : this.state;
    let key = data.periodTotal ? 'Total' : 'New';
    if (currentRate === 'confirmed') key += 'Confirmed';
    if (currentRate === 'recovered') key += 'Recovered';
    if (currentRate === 'deaths') key += 'Deaths';
    if (!data.populationTotal) key += '100k';
    return key;
  }

  getDataCountry(ctx, elem, currentRate) {
    const key = this.getKey.call(ctx, currentRate);
    return elem[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  toggleSizeContainer() {
    this.btnFull.addEventListener('click', () => {
      this.container.classList.toggle('full');
    });
  }

  setStatePeriodAndPopulation() {
    const setValue = (key, value) => {
      this.state.set(key, value);
    };

    this.btnAllPeriod.addEventListener('change', setValue.bind(this, 'periodTotal', true));
    this.btnLastDay.addEventListener('change', setValue.bind(this, 'periodTotal', false));
    this.btnTotalCases.addEventListener('change', setValue.bind(this, 'populationTotal', true));
    this.btnPer100k.addEventListener('change', setValue.bind(this, 'populationTotal', false));
  }

  setValueRadioBtn() {
    this.btnAllPeriod.checked = this.state.periodTotal;
    this.btnLastDay.checked = !this.state.periodTotal;
    this.btnTotalCases.checked = this.state.populationTotal;
    this.btnPer100k.checked = !this.state.populationTotal;
  }
}

const components = new Components();

export default components;
