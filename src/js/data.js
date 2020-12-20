import {
  WORLD_POPULATION, API_COVID_GLOBAL, API_COUNTRIES, API_COVID_COUNTRIES, API_COVID_HISTORICAL,
} from './config';

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

export default async function getData() {
  const covidData = await getJSON(API_COVID_GLOBAL);
  const countriesData = await getJSON(API_COUNTRIES);
  if (covidData && covidData.Countries && Array.isArray(countriesData)) {
    const data = await getJSON(API_COVID_COUNTRIES);
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
          population: item.population,
        });
      });
    }

    let historical = '';

    covidData.Global.NewConfirmed100k = getDataPer100k(covidData.Global.NewConfirmed,
      WORLD_POPULATION);
    covidData.Global.NewDeaths100k = getDataPer100k(covidData.Global.NewDeaths,
      WORLD_POPULATION);
    covidData.Global.NewRecovered100k = getDataPer100k(covidData.Global.NewRecovered,
      WORLD_POPULATION);
    covidData.Global.TotalConfirmed100k = getDataPer100k(covidData.Global.TotalConfirmed,
      WORLD_POPULATION);
    covidData.Global.TotalDeaths100k = getDataPer100k(covidData.Global.TotalDeaths,
      WORLD_POPULATION);
    covidData.Global.TotalRecovered100k = getDataPer100k(covidData.Global.TotalRecovered,
      WORLD_POPULATION);

    covidData.Countries.forEach((item) => {
      const curr = item;
      delete curr.Premium;
      historical += `${item.CountryCode},`;
      const res = countriesData.find((country) => country.alpha2Code === item.CountryCode);
      if (res) {
        curr.alpha3Code = res.alpha3Code;
        curr.latlng = res.latlng;
        curr.flag = res.flag;
        curr.population = res.population;
        curr.NewConfirmed100k = getDataPer100k(curr.NewConfirmed, curr.population);
        curr.NewDeaths100k = getDataPer100k(curr.NewDeaths, curr.population);
        curr.NewRecovered100k = getDataPer100k(curr.NewRecovered, curr.population);
        curr.TotalConfirmed100k = getDataPer100k(curr.TotalConfirmed, curr.population);
        curr.TotalDeaths100k = getDataPer100k(curr.TotalDeaths, curr.population);
        curr.TotalRecovered100k = getDataPer100k(curr.TotalRecovered, curr.population);
      }
    });
    delete covidData.Message;
    const histCountry = await getJSON(`${API_COVID_HISTORICAL}${historical}?lastdays=366`);
    const histGlobal = await getJSON(`${API_COVID_HISTORICAL}all?lastdays=366`);
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
  return null;
}
