export default class Countries {
  constructor(state) {
    this.state = state;
  }

  render() {
    console.log('render Countries');
    console.log(this.state);
    this.createCountries();
  }

  update() {
    console.log('update Countries');
    console.log(this.state);
  }

  createCountries() {
    /* const input = document.querySelector('.input-country'); */
    const listCountries = document.querySelector('.list-countries');
    console.log(this.state.data.Countries);
    this.state.data.Countries.forEach((el, i) => {
      const item = document.createElement('li');
      item.classList.add('item');
      item.innerHTML = `<span>${i + 1}. ${el.Country}</span> <img class="flag" src="${el.flag}">`;
      console.log(item);

      item.addEventListener('click', () => {
        /* eslint-disable-next-line */
        for (const elem of list.children) {
          elem.classList.remove('active');
        }
        item.classList.add('active');
      });

      listCountries.append(item);
    });
  }
}

/* eslint-disable-next-line */
/* this.searchCountry(input, list); */
/*   searchCountry(input, list) {
    input.addEventListener('input', ({target: {value}}) => { */
/* eslint-disable-next-line */
/*       for (const elem of list.children) {
        if (value.length === 0) elem.classList.remove('hide');

        const textElem = elem.firstElementChild.textContent.replace(/[\d.]\s?/g, '');
        if (textElem.toLowerCase().startsWith(value) || textElem.startsWith(value)) {
          elem.classList.remove('hide');
        } else {
          elem.classList.add('hide');
        }
      }
    });
  } */
