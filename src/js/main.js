import '../sass/style.scss';
import App from './app';

const { getData } = require('./data');

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

window.onload = () => {
  document.querySelector('#error-button').addEventListener('click', () => {
    hideError();
    showPreloader();
    document.location.reload();
  });

  getData().then((data) => {
    hidePreloader();
    if (data) app.init(data);
    else showError();
  });
};
