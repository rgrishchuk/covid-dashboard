class Keyboard {
  constructor() {
    this.inputCountry = document.querySelector('.input-country');
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };
    this.properties = {
      value: '',
      capsLock: false,
    };
  }

  init(searchCountry, listCountries) {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.inputCountry.addEventListener('focus', () => {
      this.open(this.inputCountry.value, (currentValue) => {
        this.inputCountry.value = currentValue;
        searchCountry(this.inputCountry.value, listCountries);
      });
    });
    this.closeMenu();
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'space',
    ];

    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');
          keyElement.addEventListener('click', this.deleteSymbol.bind(this));
          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');
          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');
          keyElement.addEventListener('click', this.insertSymbol.bind(this, '\n', 1));
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.addEventListener('click', this.insertSymbol.bind(this, ' ', 1));
          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');
          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', () => {
            const symbol = this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.insertSymbol(symbol, 1);
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  insertSymbol(symbol, offsetCursor) {
    const posCursor = this.inputCountry.selectionStart;
    const start = this.inputCountry.value.slice(0, posCursor);
    const end = this.inputCountry.value.substring(posCursor);

    this.inputCountry.value = start + symbol + end;
    this.triggerEvent('oninput');
    this.inputCountry.selectionEnd = posCursor + offsetCursor;
    this.inputCountry.selectionStart = posCursor + offsetCursor;
    this.inputCountry.focus();
  }

  deleteSymbol() {
    const posCursor = this.inputCountry.selectionStart;
    const prevPosCursor = posCursor <= 0 ? 0 : posCursor - 1;
    const start = this.inputCountry.value.slice(0, prevPosCursor);
    const end = this.inputCountry.value.substring(posCursor);

    this.inputCountry.value = start + end;
    this.triggerEvent('oninput');
    this.inputCountry.selectionEnd = prevPosCursor;
    this.inputCountry.selectionStart = prevPosCursor;
    this.inputCountry.focus();
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.inputCountry.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  }

  open(initialValue, oninput, onclose) {
    this.inputCountry.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--show');
  }

  close() {
    this.inputCountry.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--show');
  }

  closeMenu() {
    document.addEventListener('click', (e) => {
      const { target } = e;
      console.log(target);
      const itsKeyboard = target === this.elements.main || this.elements.main.contains(target);
      console.log('key', itsKeyboard);
      const itsInputCountry = target === this.inputCountry;
      console.log('input', itsInputCountry);
      const keyboardIsActive = this.elements.main.classList.contains('keyboard--show');
      console.log('active', keyboardIsActive);

      if (!itsKeyboard && !itsInputCountry && keyboardIsActive) {
        this.elements.main.classList.toggle('keyboard--show');
      }
    });
  }
}

const keyboard = new Keyboard();

export default keyboard;
