const WORLD_POPULATION = 7795000000;

async function getJSON(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    return null;
  }
}

function perThousand(value, all) {
  return Math.ceil(((value * 100000) / all) * 10) / 10;
}

export default async function getData() {
  const covidData = await getJSON('https://api.covid19api.com/summary');
  const countriesData = await getJSON('https://restcountries.eu/rest/v2');
  if (covidData && covidData.Countries && Array.isArray(countriesData)) {
    let historical = '';

    covidData.Global.NewConfirmed100k = perThousand(covidData.Global.NewConfirmed,
      WORLD_POPULATION);
    covidData.Global.NewDeaths100k = perThousand(covidData.Global.NewDeaths,
      WORLD_POPULATION);
    covidData.Global.NewRecovered100k = perThousand(covidData.Global.NewRecovered,
      WORLD_POPULATION);
    covidData.Global.TotalConfirmed100k = perThousand(covidData.Global.TotalConfirmed,
      WORLD_POPULATION);
    covidData.Global.TotalDeaths100k = perThousand(covidData.Global.TotalDeaths,
      WORLD_POPULATION);
    covidData.Global.TotalRecovered100k = perThousand(covidData.Global.TotalRecovered,
      WORLD_POPULATION);

    covidData.Countries.forEach((item) => {
      const curr = item;
      delete curr.Premium;
      historical += `${item.CountryCode},`;
      const res = countriesData.find((country) => country.alpha2Code === item.CountryCode);
      if (res) {
        curr.latlng = res.latlng;
        curr.flag = res.flag;
        curr.population = res.population;
        curr.NewConfirmed100k = perThousand(curr.NewConfirmed, curr.population);
        curr.NewDeaths100k = perThousand(curr.NewDeaths, curr.population);
        curr.NewRecovered100k = perThousand(curr.NewRecovered, curr.population);
        curr.TotalConfirmed100k = perThousand(curr.TotalConfirmed, curr.population);
        curr.TotalDeaths100k = perThousand(curr.TotalDeaths, curr.population);
        curr.TotalRecovered100k = perThousand(curr.TotalRecovered, curr.population);
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
