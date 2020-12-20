export default class CovidChart {
  constructor(state) {
    this.state = state;
    this.rateRadioButton = document.getElementsByName('chart__rate');
    this.checkbox100k = document.getElementById('chart__per100k');
    this.periodRadioButton = document.getElementsByName('chart__period');
  }

  createChart() {
    this.ctx = document.getElementById('covidChart').getContext('2d');
    // eslint-disable-next-line no-undef
    this.covidChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    });
    this.data = this.getData();
    this.displayData();
  }

  getData() {
    console.log(this.state);
    let data = null;
    if (this.state.currentCountry === 'global') {
      data = this.state.data.Global.timeline;
    } else {
      data = this.state.data.Countries[this.state.currentCountry].timeline;
    }
    return data;
  }

  displayData() {
    console.log(this.data);
    if (this.data) {
      document.getElementById('chart__wrapper').classList.add('active');
      document.getElementById('no_data').classList.remove('active');
    } else {
      document.getElementById('chart__wrapper').classList.remove('active');
      document.getElementById('no_data').classList.add('active');
    }
  }

  updateButtonsState() {
    // console.log('update buttons');
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
    // console.log(this.state);
  }

  update() {
    console.log('update Chart');
    this.updateButtonsState();
  }
}
