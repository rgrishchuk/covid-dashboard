async function getJSON(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}

export default async function getData() {
  const covidData = await getJSON('https://api.covid19api.com/summary');
  const countriesData = await getJSON('https://restcountries.eu/rest/v2');
  if (covidData && covidData.Countries && Array.isArray(countriesData)) {
    let historical = '';
    covidData.Countries.forEach((item) => {
      const curr = item;
      historical += `${item.CountryCode},`;
      const res = countriesData.find((country) => country.alpha2Code === item.CountryCode);
      if (res) {
        curr.latlng = res.latlng;
        curr.flag = res.flag;
        curr.population = res.population;
      }
    });
    delete covidData.Message;
    const histCountry = await getJSON(`https://disease.sh/v3/covid-19/historical/${historical}?lastdays=366`);
    const histGlobal = await getJSON('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
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
    return covidData;
  }
  return null;
}
