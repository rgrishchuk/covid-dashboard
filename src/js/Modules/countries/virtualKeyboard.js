const inputCountry = document.querySelector('.input-country');

const keyLayout = [
  ['`', '~', 'ё', 'Ё', 'Backquote'],
  ['1', '!', '1', '!', 'Digit1'],
  ['2', '@', '2', '"', 'Digit2'],
  ['3', '#', '3', '№', 'Digit3'],
  ['4', '$', '4', ';', 'Digit4'],
  ['5', '%', '5', '%', 'Digit5'],
  ['6', '^', '6', ':', 'Digit6'],
  ['7', '&', '7', '?', 'Digit7'],
  ['8', '*', '8', '*', 'Digit8'],
  ['9', '(', '9', '(', 'Digit9'],
  ['0', ')', '0', ')', 'Digit0'],
  ['-', '_', '-', '_', 'Minus'],
  ['=', '+', '=', '+', 'Equal'],
  ['backspace', '', '', '', 'Backspace'],
  ['tab', '', '', '', 'Tab'],
  ['q', 'Q', 'й', 'Й', 'KeyQ'],
  ['w', 'W', 'ц', 'Ц', 'KeyW'],
  ['e', 'E', 'у', 'У', 'KeyE'],
  ['r', 'R', 'к', 'К', 'KeyR'],
  ['t', 'T', 'е', 'Е', 'KeyT'],
  ['y', 'Y', 'н', 'Н', 'KeyY'],
  ['u', 'U', 'г', 'Г', 'KeyU'],
  ['i', 'I', 'ш', 'Ш', 'KeyI'],
  ['o', 'O', 'щ', 'Щ', 'KeyO'],
  ['p', 'P', 'з', 'З', 'KeyP'],
  ['[', '{', 'х', 'Х', 'BracketLeft'],
  [']', '}', 'ъ', 'Ъ', 'BracketRight'],
  ['\\', '|', '\\', '/', 'Backslash'],
  ['caps', '', '', '', 'CapsLock'],
  ['a', 'A', 'ф', 'Ф', 'KeyA'],
  ['s', 'S', 'ы', 'Ы', 'KeyS'],
  ['d', 'D', 'в', 'В', 'KeyD'],
  ['f', 'F', 'а', 'А', 'KeyF'],
  ['g', 'G', 'п', 'П', 'KeyG'],
  ['h', 'H', 'р', 'Р', 'KeyH'],
  ['j', 'J', 'о', 'О', 'KeyJ'],
  ['k', 'K', 'л', 'Л', 'KeyK'],
  ['l', 'L', 'д', 'Д', 'KeyL'],
  [';', ':', 'ж', 'Ж', 'Semicolon'],
  ["'", '"', 'э', 'Э', 'Quote'],
  ['enter', '', '', '', 'Enter'],
  ['shift', '', '', '', 'ShiftLeft'],
  ['z', 'Z', 'я', 'Я', 'KeyZ'],
  ['x', 'X', 'ч', 'Ч', 'KeyX'],
  ['c', 'C', 'с', 'С', 'KeyC'],
  ['v', 'V', 'м', 'М', 'KeyV'],
  ['b', 'B', 'и', 'И', 'KeyB'],
  ['n', 'N', 'т', 'Т', 'KeyN'],
  ['m', 'M', 'ь', 'Ь', 'KeyM'],
  [',', '<', 'б', 'Б', 'Comma'],
  ['.', '>', 'ю', 'Ю', 'Period'],
  ['/', '?', '.', ',', 'Slash'],
  ['up', '', '', '', 'ArrowUp'],
  ['en/ru', '', '', '', ''],
  ['space', '', '', '', 'Space'],
  ['done', '', '', '', ''],
  ['left', '', '', '', 'ArrowLeft'],
  ['down', '', '', '', 'ArrowDown'],
  ['right', '', '', '', 'ArrowRight'],
];

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    lang_ru: false,
  },

  init(searchCountry, listCountries) {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.input-country').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          /* eslint-disable-next-line */
          element.value = currentValue;
          searchCountry(element.value, listCountries);
          console.log(element.value);
        });
      });
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const insertLineBreak = ['backspace', '\\', 'enter', 'up'];

    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      this.keyIllumination(key, keyElement);

      switch (key[0]) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            this.deleteSymbol();
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--caps', 'keyboard__key--activatable');
          keyElement.innerHTML = '<i>CapsLock</i>';

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            this.toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });
          inputCountry.addEventListener('keydown', (event) => {
            if (event.code === key[4]) {
              this.toggleCapsLock();
              keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
            }
          });

          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--shift', 'keyboard__key--activatable');
          keyElement.innerHTML = '<i>Shift</i>';

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            this.toggleShift();
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
          });
          inputCountry.addEventListener('keydown', (event) => {
            if (event.code === key[4]) {
              this.toggleShift();
              keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
            }
          });

          break;

        case 'en/ru':
          keyElement.classList.add('keyboard__key--en_ru');
          keyElement.innerHTML = '<i><i class="active-lang">en</i><i class="slash">/</i><i>ru</i>';

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            this.toggleLanguage();
            keyElement.firstElementChild.firstElementChild.classList.toggle(
              'active-lang',
              !this.properties.lang_ru,
            );
            keyElement.firstElementChild.lastElementChild.classList.toggle(
              'active-lang',
              this.properties.lang_ru,
            );
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            const symbol = '\n';
            this.insertSymbol(symbol, 1);
          });

          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = '<img>Tab</img>';

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            const symbol = '    ';
            this.insertSymbol(symbol, 4);
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            const symbol = ' ';
            this.insertSymbol(symbol, 1);
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            this.close();
            inputCountry.blur();
            this.triggerEvent('onclose');
          });

          break;

        case 'left':
          keyElement.innerHTML = '<i>◄</i>';
          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            let positionCursor = inputCountry.selectionStart - 1;
            if (positionCursor <= 0) positionCursor = 0;
            inputCountry.selectionEnd = positionCursor;
            inputCountry.selectionStart = positionCursor;
            this.triggerEvent('oninput');
          });

          break;

        case 'right':
          keyElement.innerHTML = '<i>►</i>';

          keyElement.addEventListener('click', () => {
            const positionCursor = inputCountry.selectionStart + 1;
            inputCountry.selectionEnd = positionCursor;
            inputCountry.selectionStart = positionCursor;
            inputCountry.focus();
            this.triggerEvent('oninput');
          });

          break;

        case 'up':
          keyElement.innerHTML = '<i>▲</i>';
          this.triggerEvent('oninput');
          keyElement.addEventListener('click', () => {
            inputCountry.focus();
          });
          break;

        case 'down':
          keyElement.innerHTML = '<i>▼</i>';
          this.triggerEvent('oninput');
          keyElement.addEventListener('click', () => {
            inputCountry.focus();
          });
          break;

        default:
          keyElement.textContent = key[0].toLowerCase();

          keyElement.addEventListener('click', () => {
            inputCountry.focus();
            const symbol = this.transformSymbol(key);
            this.insertSymbol(symbol, 1);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak.includes(key[0])) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  keyIllumination(key, obj) {
    function onBacklight(event) {
      if (event.code === key[4]) {
        obj.classList.add('active');
      }
    }

    function offBacklight(event) {
      if (event.code === key[4]) {
        obj.classList.remove('active');
      }
    }

    window.addEventListener('keydown', onBacklight);
    window.addEventListener('keyup', offBacklight);
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (!this.properties.shift) {
          key.textContent = this.properties.capsLock
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase();
        } else {
          key.textContent = !this.properties.capsLock
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase();
        }
      }
    }
  },

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    let index = 0;
    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.transformSymbol(keyLayout[index]);
      }
      index += 1;
    }
  },

  toggleLanguage() {
    this.properties.lang_ru = !this.properties.lang_ru;
    let index = 0;
    /* eslint-disable-next-line */
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.transformSymbol(keyLayout[index]);
      }
      index += 1;
    }
  },

  insertSymbol(symbol, offsetCursor) {
    const posCursor = inputCountry.selectionStart;
    const start = this.properties.value.slice(0, posCursor);
    const end = this.properties.value.substring(posCursor);

    this.properties.value = start + symbol + end;
    this.triggerEvent('oninput');
    inputCountry.selectionEnd = posCursor + offsetCursor;
    inputCountry.selectionStart = posCursor + offsetCursor;
  },

  deleteSymbol() {
    const posCursor = inputCountry.selectionStart;
    const prevPosCursor = posCursor <= 0 ? 0 : posCursor - 1;
    const start = this.properties.value.slice(0, prevPosCursor);
    const end = this.properties.value.substring(posCursor);

    this.properties.value = start + end;
    this.triggerEvent('oninput');
    inputCountry.selectionEnd = prevPosCursor;
    inputCountry.selectionStart = prevPosCursor;
  },

  transformSymbol(value) {
    if (this.properties.lang_ru) {
      if (this.properties.shift) {
        return this.properties.capsLock ? value[3].toLowerCase() : value[3].toUpperCase();
      }
      return !this.properties.capsLock ? value[2].toLowerCase() : value[2].toUpperCase();
    }
    if (this.properties.shift) {
      return this.properties.capsLock ? value[1].toLowerCase() : value[1].toUpperCase();
    }
    return !this.properties.capsLock ? value[0].toLowerCase() : value[0].toUpperCase();
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

export default Keyboard;
