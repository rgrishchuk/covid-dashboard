class Components {
  constructor() {
    this.result = '';
  }

  getDataCountry(state, data, currentRate) {
    const { periodTotal, populationTotal } = state;
    const calcDataPer100k = (num) => Math.round((num / data.population) * 100000);
    const getDataBasedOnSettings = (totalCases, newCases) => {
      if (periodTotal && !populationTotal) return calcDataPer100k(totalCases);
      if (!periodTotal && !populationTotal) return calcDataPer100k(newCases);
      if (!periodTotal && populationTotal) return newCases;
      return totalCases;
    };

    switch (currentRate) {
      case 'confirmed':
        this.result = getDataBasedOnSettings(data.TotalConfirmed, data.NewConfirmed);
        break;
      case 'deaths':
        this.result = getDataBasedOnSettings(data.TotalDeaths, data.NewDeaths);
        break;
      case 'recovered':
        this.result = getDataBasedOnSettings(data.TotalRecovered, data.NewRecovered);
        break;
      default:
        this.result = data.TotalConfirmed;
    }
    return this.result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  /* eslint-disable-next-line */
  toggleSizeContainer(btn, container) {
    btn.addEventListener('click', () => {
      container.classList.toggle('full');
    });
  }
  /* eslint-disable-next-line */
  setStatePeriodAndPopulation(ctx) {
    const setValue = (key, value) => {
      ctx.state.set(key, value);
    };
    ctx.btnAllPeriod.addEventListener('change', setValue.bind(ctx, 'periodTotal', true));
    ctx.btnLastDay.addEventListener('change', setValue.bind(ctx, 'periodTotal', false));
    ctx.btnTotalCases.addEventListener('change', setValue.bind(ctx, 'populationTotal', true));
    ctx.btnPer100k.addEventListener('change', setValue.bind(ctx, 'populationTotal', false));
  }
  /* eslint-disable-next-line */
  setValueRadioBtn(ctx) {
    ctx.btnAllPeriod.checked = ctx.state.periodTotal;
    ctx.btnLastDay.checked = !ctx.state.periodTotal;
    ctx.btnTotalCases.checked = ctx.state.populationTotal;
    ctx.btnPer100k.checked = !ctx.state.populationTotal;
  }
}

const components = new Components();

export default components;
