import '../sass/style.scss';
import App from './app';

const { getData } = require('./data');

const UPDATE_INTERVAL = 6 * 60 * 60000;
const UPDATE_INTERVAL_ON_ERROR = 5 * 60000;

const app = new App();

function showPreloader() {
  document.querySelector('#overlay').classList.add('active');
  document.querySelector('#preloader').classList.add('active');
}

function hidePreloader() {
  document.querySelector('#overlay').classList.remove('active');
  document.querySelector('#preloader').classList.remove('active');
}

function hideError() {
  document.querySelector('#error').classList.remove('active');
  showPreloader();
}

function showError() {
  document.querySelector('#overlay').classList.add('active');
  document.querySelector('#error').classList.add('active');
}

showPreloader();

function updateData() {
  showPreloader();
  getData().then((data) => {
    hidePreloader();
    if (data) {
      app.updateData(data);
      setTimeout(updateData, UPDATE_INTERVAL);
    } else setTimeout(updateData, UPDATE_INTERVAL_ON_ERROR);
  });
}

window.onload = () => {
  document.querySelector('#error-button').addEventListener('click', () => {
    hideError();
    showPreloader();
    document.location.reload();
  });

  getData().then((data) => {
    hidePreloader();
    if (data) {
      app.init(data);
      setTimeout(updateData, UPDATE_INTERVAL);
    } else showError();
  });
};
