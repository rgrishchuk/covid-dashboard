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
    covidData.Countries.forEach((item) => {
      const tmp = item;
      const res = countriesData.find((country) => country.alpha2Code === item.CountryCode);
      if (res) {
        tmp.flag = res.flag;
        tmp.population = res.population;
      }
    });
    delete covidData.Message;
    return covidData;
  }
  return null;
}
