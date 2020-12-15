export default class Map {
  constructor(state) {
    this.state = state;
  }

  render() {
    console.log('render Map');
    console.log(this.state);
  }

  update() {
    console.log('update Map');
    console.log(this.state);
  }
}
