export default class Chart {
  constructor(state) {
    this.state = state;
  }

  render() {
    console.log('render Chart');
    console.log(this.state);
  }

  update() {
    console.log('update Chart');
    console.log(this.state);
  }
}
