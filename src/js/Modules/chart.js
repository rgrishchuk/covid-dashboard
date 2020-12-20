export default class CovidChart {
  constructor(state) {
    this.state = state;
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
  }

  render() {
    document.querySelector('.chart #icon-full-chart').addEventListener('click', () => {
      document.querySelector('.chart').classList.toggle('fullscreen');
    });
    this.createChart();
    console.log(this.state);
  }

  update() {
    console.log('update Chart');
    console.log(this.state);
  }
}
