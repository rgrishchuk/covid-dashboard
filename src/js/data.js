const API_COVID = 'https://disease.sh/v3/covid-19/';
const API_COUNTRIES = 'https://restcountries.eu/rest/v2';

async function getJSON(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}

function getDataPer100k(value, all) {
  return Math.ceil(((value * 100000) / all) * 100) / 100;
}

async function getData() {
  const covidData = {};
  let data = await getJSON(`${API_COVID}all`);
  if (data) {
    covidData.Global = {};
    covidData.Global.population = data.population;
    covidData.Global.NewConfirmed = data.todayCases;
    covidData.Global.NewDeaths = data.todayDeaths;
    covidData.Global.NewRecovered = data.todayRecovered;
    covidData.Global.TotalConfirmed = data.cases;
    covidData.Global.TotalDeaths = data.deaths;
    covidData.Global.TotalRecovered = data.recovered;
    covidData.Date = data.updated;
    covidData.Global.NewConfirmed100k = getDataPer100k(covidData.Global.NewConfirmed,
      covidData.Global.population);
    covidData.Global.NewDeaths100k = getDataPer100k(covidData.Global.NewDeaths,
      covidData.Global.population);
    covidData.Global.NewRecovered100k = getDataPer100k(covidData.Global.NewRecovered,
      covidData.Global.population);
    covidData.Global.TotalConfirmed100k = getDataPer100k(covidData.Global.TotalConfirmed,
      covidData.Global.population);
    covidData.Global.TotalDeaths100k = getDataPer100k(covidData.Global.TotalDeaths,
      covidData.Global.population);
    covidData.Global.TotalRecovered100k = getDataPer100k(covidData.Global.TotalRecovered,
      covidData.Global.population);
  } else return null;
  data = await getJSON(`${API_COVID}countries`);
  if (Array.isArray(data)) {
    covidData.Countries = [];
    data.forEach((item) => {
      covidData.Countries.push({
        Country: item.country,
        CountryCode: item.countryInfo.iso2,
        NewConfirmed: item.todayCases,
        NewDeaths: item.todayDeaths,
        NewRecovered: item.todayRecovered,
        TotalConfirmed: item.cases,
        TotalDeaths: item.deaths,
        TotalRecovered: item.recovered,
        NewConfirmed100k: getDataPer100k(item.todayCases, item.population),
        NewDeaths100k: getDataPer100k(item.todayDeaths, item.population),
        NewRecovered100k: getDataPer100k(item.todayRecovered, item.population),
        TotalConfirmed100k: getDataPer100k(item.cases, item.population),
        TotalDeaths100k: getDataPer100k(item.deaths, item.population),
        TotalRecovered100k: getDataPer100k(item.recovered, item.population),
        population: item.population,
      });
    });
  } else return null;
  let historical = '';
  const countriesData = await getJSON(API_COUNTRIES);
  if (Array.isArray(countriesData)) {
    covidData.Countries.forEach((item) => {
      const curr = item;
      historical += `${item.CountryCode},`;
      const res = countriesData.find((country) => country.alpha2Code === item.CountryCode);
      if (res) {
        curr.alpha3Code = res.alpha3Code;
        curr.latlng = res.latlng;
        curr.flag = res.flag;
      }
    });
  } else return null;
  const histCountry = await getJSON(`${API_COVID}historical/${historical}?lastdays=366`);
  const histGlobal = await getJSON(`${API_COVID}historical/all?lastdays=366`);
  if (histCountry && histGlobal) {
    covidData.Global.timeline = histGlobal;
    covidData.Countries.forEach((item) => {
      const currCountry = item;
      const res = histCountry.find((curr) => {
        if (curr && curr.country === item.Country) return true;
        return false;
      });
      if (res) {
        currCountry.timeline = res.timeline;
      } else currCountry.timeline = null;
    });
  } else return null;
  const newData = [];
  covidData.Countries.forEach((item) => {
    if (item.latlng) newData.push(item);
  });
  covidData.Countries = newData;
  covidData.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  return covidData;
}

module.exports = { getData, getJSON, getDataPer100k };
