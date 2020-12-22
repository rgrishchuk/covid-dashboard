export default class CovidChart {
  constructor(state) {
    this.state = state;
    this.rateRadioButton = document.getElementsByName('chart__rate');
    this.checkbox100k = document.getElementById('chart__per100k');
    this.periodRadioButton = document.getElementsByName('chart__period');
  }

  createChart() {
    const ctx = document.getElementById('covidChart').getContext('2d');
    // eslint-disable-next-line no-undef
    this.covidChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: '',
            fill: false,
            borderColor: 'red',
          },
        ],
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false,
          displayColors: false,
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 14,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white',
              fontSize: 14,
            },
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              fontSize: 14,
            },
            type: 'time',
            time: {
              unit: 'month',
            },
          }],
        },
      },
    });
    this.updateChart();
  }

  updateChart() {
    this.data = this.getData();
    if (this.data) {
      let color = '#080808';
      const rate = this.getRateName();
      if (rate === 'cases') color = '#c91313';
      else if (rate === 'recovered') color = '#06c506';
      const currCountry = this.state.currentCountry === 'global' ? 'World' : this.state.currentCountry;
      this.covidChart.data.datasets[0].label = currCountry;
      this.covidChart.data.datasets[0].borderColor = color;
      this.covidChart.data.datasets[0].data = this.data;
      this.covidChart.update();
    }
    this.displayData();
  }

  getRateName() {
    let rate;
    if (this.state.currentRate === 'confirmed') rate = 'cases';
    else if (this.state.currentRate === 'recovered') rate = 'recovered';
    else if (this.state.currentRate === 'deaths') rate = 'deaths';
    return rate;
  }

  getData() {
    let covidData = null;
    let population = null;
    if (this.state.currentCountry === 'global') {
      covidData = this.state.data.Global.timeline;
      population = this.state.data.Global.population;
    } else {
      const currCountry = this.state.data.Countries.find((country) => {
        if (country.Country === this.state.currentCountry) return country;
        return false;
      });
      covidData = currCountry.timeline;
      population = currCountry.population;
    }
    if (!covidData) return null;

    const key = this.getRateName();
    covidData = covidData[key];
    let data = [];
    Object.keys(covidData).forEach((date) => {
      data.push([date, covidData[date]]);
    });

    if (!this.state.periodTotal) {
      const newData = [];
      newData.push(data[0]);
      for (let index = 1; index < data.length; index += 1) {
        if (data[index][1] >= data[index - 1][1]) {
          newData.push([data[index][0], data[index][1] - data[index - 1][1]]);
        } else {
          newData.push([data[index][0], 0]);
        }
      }
      data = newData;
    }

    if (!this.state.populationTotal) {
      data = data.map((item) => {
        const newItem = item;
        newItem[1] = Math.ceil(((item[1] * 100000) / population) * 100) / 100;
        return newItem;
      });
    }

    const result = [];
    data.forEach((item) => {
      const date = new Date(item[0]);
      const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
      const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      result.push({ x: `${year}-${month}-${day}`, y: item[1] });
    });
    return result;
  }

  displayData() {
    if (this.data) {
      document.getElementById('chart__wrapper').classList.add('active');
      document.getElementById('no_data').classList.remove('active');
    } else {
      document.getElementById('chart__wrapper').classList.remove('active');
      document.getElementById('no_data').classList.add('active');
    }
  }

  addListeners() {
    this.rateRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        this.state.set('currentRate', button.value);
      });
    });
    this.periodRadioButton.forEach((button) => {
      button.addEventListener('change', () => {
        let value = false;
        if (button.value === 'all') value = true;
        this.state.set('periodTotal', value);
      });
    });
    this.checkbox100k.addEventListener('change', () => {
      this.state.set('populationTotal', !this.checkbox100k.checked);
    });
  }

  updateButtonsState() {
    this.rateRadioButton.forEach((button) => {
      const btn = button;
      if (button.value === this.state.currentRate) {
        btn.checked = true;
      }
    });
    if (this.state.periodTotal) {
      this.periodRadioButton[0].checked = true;
    } else {
      this.periodRadioButton[1].checked = true;
    }
    this.checkbox100k.checked = !this.state.populationTotal;
  }

  render() {
    document.querySelector('.chart #icon-full-chart').addEventListener('click', () => {
      document.querySelector('.chart').classList.toggle('fullscreen');
    });
    this.createChart();
    this.addListeners();
  }

  update() {
    this.updateButtonsState();
    this.updateChart();
  }

  reset() {
    this.updateChart();
  }
}
