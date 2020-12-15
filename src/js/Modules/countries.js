export default class Countries {
  constructor(state) {
    this.state = state;
  }

  render() {
    console.log('render Countries');
    console.log(this.state);
  }

  update() {
    console.log('update Countries');
    console.log(this.state);
  }
}
