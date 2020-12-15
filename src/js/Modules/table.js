export default class Table {
  constructor(state) {
    this.state = state;
  }

  render() {
    console.log('render Table');
    console.log(this.state);
  }

  update() {
    console.log('update Table');
    console.log(this.state);
  }
}
